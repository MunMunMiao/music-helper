import { JSDOM } from 'jsdom'
import { getCover, Photo } from '@/lib/bugs/album'
import { toNumber } from '@/lib/common/core'

export interface SearchSongOptions {
    keyword?: string | null
    page?: number | null
    pageSize?: number | null
}

export interface SearchAlbumOptions {
    keyword?: string | null
    page?: number | null
    pageSize?: number | null
}

export type ListSearchResult = {
    total: number
    items: SearchResult[]
}

export type SearchResult = {
    name?: string
    artist?: string
    album?: string
    cover?: string
    origin?: string
    albumId?: number
    artistId?: number
    trackId?: number
}

export async function searchSong(options: SearchSongOptions): Promise<ListSearchResult> {
    const url: URL = new URL('/search/track', 'https://music.bugs.co.kr/')

    if (options?.keyword) {
        url.searchParams.set('q', options.keyword)
        url.searchParams.set('query', options.keyword)
    }

    if (options?.page) {
        url.searchParams.set('page', options.page.toString())
    }

    if (options?.pageSize) {
        url.searchParams.set('size', options.pageSize.toString())
    }

    const resp = await fetch(url)
    const html = await resp.text()
    const dom = JSDOM.fragment(html)
    const rows = dom.querySelectorAll('table.trackList tbody tr')
    const totalString = dom.querySelector<HTMLAnchorElement>('.tabSearch a.track')?.text
    let total: number = 0

    if (totalString) {
        const result = totalString.match(/[0-9]+/ig)
        if (result) {
            total = Number(result.join(''))
        }
    }

    const result: SearchResult[] = []
    const albumIds: number[] = []

    for (const item of rows) {
        const albumId = item.attributes.getNamedItem('albumid')?.nodeValue
        const artistId = item.attributes.getNamedItem('artistid')?.nodeValue
        const trackId = item.attributes.getNamedItem('trackid')?.nodeValue

        const name = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.title a`)?.text
        const artist = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.artist a`)?.text
        const album = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] a.album`)?.text

        const data: SearchResult = {
            name,
            artist,
            album,
            albumId: toNumber(albumId, {optional: true}),
            artistId: toNumber(artistId, {optional: true}),
            trackId: toNumber(trackId, {optional: true})
        }

        if (data.albumId) {
            albumIds.push(data.albumId)
        }

        result.push(data)
    }

    const coverMap = await searchCover(...albumIds)

    for (const item of result) {
        if (!item.albumId) {
            continue
        }

        const photo = coverMap.get(item?.albumId)
        if (!photo) {
            continue
        }

        item.origin = photo.origin
        item.cover = photo.cover
    }

    return {
        total,
        items: result
    }
}

export async function searchAlbum(options: SearchAlbumOptions): Promise<ListSearchResult> {
    const url: URL = new URL('/search/album', 'https://music.bugs.co.kr/')

    if (options?.keyword) {
        url.searchParams.set('q', options.keyword)
        url.searchParams.set('query', options.keyword)
    }

    if (options?.page) {
        url.searchParams.set('page', options.page.toString())
    }

    if (options?.pageSize) {
        url.searchParams.set('size', options.pageSize.toString())
    }

    const resp = await fetch(url)
    const html = await resp.text()
    const dom = JSDOM.fragment(html)
    const rows = dom.querySelectorAll('ul.albumList li')
    const totalString = dom.querySelector<HTMLAnchorElement>('.tabSearch a.album')?.text
    let total: number = 0

    if (totalString) {
        const result = totalString.match(/[0-9]+/ig)
        if (result) {
            const _s = result.join('')
            total = Number(_s)
        }
    }

    const result: SearchResult[] = []
    const albumIds: number[] = []

    for (const item of rows) {
        const albumId = item.attributes.getNamedItem('albumid')?.nodeValue
        const artistId = item.attributes.getNamedItem('artistid')?.nodeValue
        const trackId = item.attributes.getNamedItem('trackid')?.nodeValue

        const cover = item.querySelector<HTMLImageElement>(`tr[trackid="${trackId}"] a.thumbnail img`)?.src
        const name = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.title a`)?.text
        const artist = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.artist a`)?.text
        const album = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] a.album`)?.text

        const data: SearchResult = {
            name,
            artist,
            album,
            albumId: toNumber(albumId, {optional: true}),
            artistId: toNumber(artistId, {optional: true}),
            trackId: toNumber(trackId, {optional: true})
        }

        if (data.albumId) {
            albumIds.push(data.albumId)
        }

        result.push(data)
    }

    const coverMap = await searchCover(...albumIds)

    for (const item of result) {
        if (!item.albumId) {
            continue
        }

        const photo = coverMap.get(item?.albumId)
        if (!photo) {
            continue
        }

        item.origin = photo.origin
        item.cover = photo.cover
    }

    return {
        total,
        items: result
    }
}

export async function searchCover(...value: number[]): Promise<Map<number, Photo>> {
    const map = new Map<number, Photo>()
    const requests = value.map(i => getCover({albumId: i, quality: 100}))
    const covers = await Promise.all(requests)

    for (const item of covers) {
        if (!item) {
            continue
        }

        map.set(item.albumId, item)
    }

    return map
}
