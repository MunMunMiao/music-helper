import { ListSearchResult, SearchResult } from '@/lib/bugs/search'
import { JSX, useEffect, useState } from 'react'
import { download } from '@/lib/common/download'
import { Button } from '@nextui-org/button'
import { useDebounce } from '@uidotdev/usehooks'
import { Pagination } from '@nextui-org/pagination'
import { Input } from '@nextui-org/input'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Spinner } from '@nextui-org/spinner'
import { Image } from '@nextui-org/image'
import { useQuery } from '@tanstack/react-query'

type DownloadButtonProps = {
    data: SearchResult
}

function DownloadButton(props: DownloadButtonProps): JSX.Element {
    const {data} = props
    const [loading, setLoading] = useState<boolean>(false)

    const onDownload = async () => {
        if (!data.origin || !data.albumId) {
            return
        }

        const url = new URL('/api/cover/bugs', location.origin)
        url.searchParams.append('album_id', data.albumId.toString())
        setLoading(true)
        const resp = await fetch(url, {
            cache: 'no-cache'
        })
        if (!resp.ok) {
            setLoading(false)
            return
        }
        const blob = await resp.blob()
        download(`${data.albumId}.jpg`, blob, {
            type: 'image/jpeg'
        })
        setLoading(false)
    }

    return (
        <Button color="primary" isLoading={loading} onClick={onDownload}>Download</Button>
    )
}

export function Bugs(): JSX.Element {
    let bottomContent: JSX.Element | undefined
    const pageSize: number = 8
    const [keyword, setKeyword] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(0)
    const debouncedKeyword = useDebounce(keyword, 300)
    const {isLoading, isError, error, data} = useQuery({
        queryKey: ['apple_music_search', debouncedKeyword, page],
        queryFn: async ({signal}) => {
            if (!debouncedKeyword) {
                throw new Error('Keyword is empty')
            }

            const url = new URL('/api/cover/bugs/search', location.origin)
            url.searchParams.append('page', page.toString())
            url.searchParams.append('page_size', pageSize.toString())
            url.searchParams.append('keyword', debouncedKeyword)
            const resp = await fetch(url, {signal})
            if (!resp.ok) {
                throw new Error(resp.statusText)
            }
            const data = await resp.json() as ListSearchResult
            setPages(Math.ceil(data.total / pageSize))
            return data.items
        }
    })


    if (pages > 0) {
        bottomContent = (
            <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={page => setPage(page)}
                />
            </div>
        )
    }

    useEffect(() => {
        setPage(1)
        setPages(0)
    }, [keyword])

    return (
        <>
            <div className="flex gap-4 py-4">
                <Input label="Keyword" value={keyword} onValueChange={setKeyword} />
            </div>

            {
                error && <div className="text-red-500">{error.message}</div>
            }

            <Table
                isStriped
                aria-label="Example static collection table"
                bottomContent={bottomContent}>
                <TableHeader>
                    <TableColumn width={120}>Cover</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Artist</TableColumn>
                    <TableColumn>Album</TableColumn>
                    <TableColumn width={220}>Action</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={'No rows to display.'}
                    isLoading={isLoading}
                    loadingContent={<Spinner />}
                >
                    {
                        (data || []).map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Image radius="none" width={50} height={50} alt={item.name} src={item.cover} referrerPolicy="no-referrer" />
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.artist}</TableCell>
                                <TableCell>{item.album}</TableCell>
                                <TableCell>
                                    <DownloadButton data={item} />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}
