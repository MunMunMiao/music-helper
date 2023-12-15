import React, { JSX, useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { useDebounce } from '@uidotdev/usehooks'
import { Input } from '@nextui-org/input'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Spinner } from '@nextui-org/spinner'
import { Image } from '@nextui-org/image'
import { SearchResult } from '@/lib/apple_music/search'
import { Select, SelectItem } from '@nextui-org/select'
import { useQuery } from '@tanstack/react-query'
import { download } from '@/lib/common/download'

type DownloadButtonProps = {
    data: SearchResult
}

function DownloadButton(props: DownloadButtonProps): JSX.Element {
    const {data} = props
    const [loading, setLoading] = useState<boolean>(false)
    const isDisabled = !data.artwork.url

    const onDownload = async () => {
        const artworkUrl = data.artwork.url.replace('{w}x{h}', `${data.artwork.width}x${data.artwork.height}`)
        const url = new URL('/api/cover/apple_music', location.origin)
        url.searchParams.append('url', artworkUrl)
        setLoading(true)
        const resp = await fetch(url, {cache: 'no-cache'})
        if (!resp.ok) {
            setLoading(false)
            return
        }
        const blob = await resp.blob()
        download(`${Math.round(Math.random() * 10000000)}.jpg`, blob, {
            type: 'image/jpeg'
        })
        setLoading(false)
    }

    return (
        <Button color="primary" isLoading={loading} disabled={isDisabled} onClick={onDownload}>Download</Button>
    )
}

function getDisplayCover(data: SearchResult): string {
    return data.artwork.url.replace('{w}x{h}', '100x100')
}

export function AppleMusic(): JSX.Element {
    const [keyword, setKeyword] = useState<string>('')
    const [groups, setGroups] = useState<'album' | 'song'>('album')
    const [offset, setOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    const [done, setDone] = useState<boolean>(false)
    const debouncedKeyword = useDebounce(keyword, 300)
    const [searchResultItems, setSearchResultItems] = useState<SearchResult[]>([])
    const columns = (() => {
        switch (groups) {
            case 'album':
                return [
                    {
                        key: 'cover',
                        label: 'Cover',
                        width: 120
                    },
                    {
                        key: 'album',
                        label: 'Album'
                    },
                    {
                        key: 'artist',
                        label: 'Artist'
                    },
                    {
                        key: 'action',
                        label: 'Action',
                        width: 220
                    }
                ]
            case 'song':
            default: {
                return [
                    {
                        key: 'cover',
                        label: 'Cover',
                        width: 120
                    },
                    {
                        key: 'name',
                        label: 'Name'
                    },
                    {
                        key: 'artist',
                        label: 'Artist'
                    },
                    {
                        key: 'album',
                        label: 'Album'
                    },
                    {
                        key: 'action',
                        label: 'Action',
                        width: 220
                    }
                ]
            }
        }
    })()
    const {isLoading, error, data} = useQuery({
        queryKey: ['apple_music_search', debouncedKeyword, groups, offset, limit],
        queryFn: async ({signal}) => {
            if (!debouncedKeyword) {
                throw new Error('Keyword is empty')
            }

            const url = new URL('/api/cover/apple_music/search', location.origin)
            url.searchParams.append('groups', groups.toString())
            url.searchParams.append('offset', offset.toString())
            url.searchParams.append('limit', limit.toString())
            url.searchParams.set('keyword', debouncedKeyword)
            const resp = await fetch(url, {signal})
            if (!resp.ok) {
                throw new Error(resp.statusText)
            }
            return await resp.json() as SearchResult[]
        }
    })
    let bottomContent: JSX.Element | undefined
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGroups(e.target.value as 'album' | 'song')
    }
    const getSearchResultColumn = (data: SearchResult, key: unknown) => {
        switch (true) {
            case key === 'cover':
                return (
                    <TableCell>
                        <Image radius="none" width={50} height={50} alt={data.albumName} src={getDisplayCover(data)} referrerPolicy="no-referrer" />
                    </TableCell>
                )
            case key === 'name':
                return (
                    <TableCell>{data.songName}</TableCell>
                )
            case key === 'album':
                return (
                    <TableCell>{data.albumName}</TableCell>
                )
            case key === 'artist':
                return (
                    <TableCell>{data.artistName}</TableCell>
                )
            case key === 'action':
                return (
                    <TableCell>
                        <DownloadButton data={data} />
                    </TableCell>
                )
            default:
                return <TableCell>-</TableCell>
        }
    }

    useEffect(() => {
        setOffset(0)
        setDone(false)
        setSearchResultItems([])
    }, [keyword, groups])

    return (
        <>
            <div className="flex gap-4 py-4">
                <Input label="Keyword" value={keyword} onValueChange={setKeyword} />
                <Select aria-label="Select groups" selectedKeys={[groups]} onChange={handleSelectionChange}>
                    <SelectItem key="album" value="album">Album</SelectItem>
                    <SelectItem key="song" value="song">Song</SelectItem>
                </Select>
            </div>

            {
                error && <div className="text-red-500">{error.message}</div>
            }

            <Table
                isStriped
                aria-label="Example static collection table">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} width={column.width}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody
                    emptyContent={'No rows to display.'}
                    isLoading={isLoading}
                    loadingContent={<Spinner />}
                >
                    {
                        (data || []).map((item, index) => (
                            <TableRow key={index}>
                                {(columnKey) => getSearchResultColumn(item, columnKey)}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}
