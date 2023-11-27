'use client'

import { ChangeEvent, ChangeEventHandler, JSX, useEffect, useState } from 'react'
import { Input } from '@nextui-org/input'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/table'
import { Image } from '@nextui-org/image'
import { ListSearchResult, SearchResult } from '@/lib/bugs/search'
import { useDebounce } from '@uidotdev/usehooks'
import { Pagination } from '@nextui-org/pagination'
import { Spinner } from '@nextui-org/spinner'
import { Button } from '@nextui-org/button'
import { download } from '@/lib/common/download'
import { Select, SelectItem } from '@nextui-org/select'

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
            mode: 'cors',
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

export default function Page() {
    const [keyword, setKeyword] = useState<string>('')
    const [source, setSource] = useState<string>('1')
    const [page, setPage] = useState<number>(1)
    const [pages, setPages] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const debouncedKeyword = useDebounce(keyword, 300)
    const [searchResultItems, setSearchResultItems] = useState<SearchResult[]>([])
    const pageSize: number = 8
    let bottomContent: JSX.Element | undefined
    const onChangeSource = (e: ChangeEvent<HTMLSelectElement>) => {
        setSource(e.target.value)
    }

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
    }, [source, keyword])

    useEffect(() => {
        const controller = new AbortController()
        let ignore = false

        const fetchData = async () => {
            try {
                const url = new URL('/api/cover/bugs/search', location.origin)
                url.searchParams.append('page', page.toString())
                url.searchParams.append('page_size', pageSize.toString())
                url.searchParams.append('source', source.toString())

                if (debouncedKeyword) {
                    url.searchParams.set('keyword', debouncedKeyword)
                }

                setLoading(true)
                const resp = await fetch(url, {signal: controller.signal})
                if (ignore) {
                    return
                }

                const data = await resp.json() as ListSearchResult
                setSearchResultItems(data.items)
                setPages(Math.ceil(data.total / pageSize))
                setLoading(false)
            } catch (e) {
                console.error(e)
                if (ignore) {
                    return
                }
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [debouncedKeyword, page, source])

    return (
        <div className="container mx-auto">
            <div className="py-4 flex gap-4">
                <Input label="Keyword" value={keyword} onValueChange={setKeyword} />

                <Select label="Select search source" value={source} selectedKeys={[source]} onChange={onChangeSource}>
                    <SelectItem key="1" value="1">Bugs</SelectItem>
                    <SelectItem key="2" value="2">Apple Music</SelectItem>
                </Select>
            </div>

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
                    isLoading={loading}
                    loadingContent={<Spinner />}
                >
                    {
                        searchResultItems.map((item, index) => (
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
        </div>
    )
}
