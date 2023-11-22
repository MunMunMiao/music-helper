import { JSDOM } from 'jsdom'
import { getThumbnail } from '@/lib/bugs/thumbnail'

type SearchOptionsType = 'track' | 'album' | 'artist'

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

export interface SearchResult {
    total: number
    items: SearchResultItem[]
}

interface SearchResultItem {
    name?: string
    artist?: string
    album?: string
    cover?: string
    albumId?: number
    artistId?: number
    trackId?: number
}

export async function searchSong(options: SearchSongOptions): Promise<SearchResult> {
    const url: URL = new URL('/search/track', 'https://music.bugs.co.kr/')

    if (options?.keyword){
        url.searchParams.set('q', options.keyword)
        url.searchParams.set('query', options.keyword)
    }

    if (options?.page){
        url.searchParams.set('page', options.page.toString())
    }

    if (options?.pageSize){
        url.searchParams.set('size', options.pageSize.toString())
    }

    const resp = await fetch(url)
    const html = await resp.text()
    const dom = JSDOM.fragment(html)
    const rows = dom.querySelectorAll('table.trackList tbody tr')
    const totalString = dom.querySelector<HTMLAnchorElement>('.tabSearch a.track')?.text
    let total: number = 0

    if (totalString){
        const result = totalString.match(/[0-9]+/ig)
        if (result){
            const _s = result.join('')
            total = Number(_s)
        }
    }

    const result: SearchResultItem[] = []

    for (const item of rows){
        const albumId = item.attributes.getNamedItem('albumid')?.nodeValue
        const artistId = item.attributes.getNamedItem('artistid')?.nodeValue
        const trackId = item.attributes.getNamedItem('trackid')?.nodeValue

        const cover = item.querySelector<HTMLImageElement>(`tr[trackid="${trackId}"] a.thumbnail img`)?.src
        const name = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.title a`)?.text
        const artist = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.artist a`)?.text
        const album = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] a.album`)?.text

        result.push({
            name,
            artist,
            album,
            cover,
            albumId: Number(albumId) || 0,
            artistId: Number(artistId) || 0,
            trackId: Number(trackId) || 0
        })
    }

    return {
        total,
        items: result
    }
}


export async function searchAlbum(options: SearchAlbumOptions): Promise<SearchResult> {
    const url: URL = new URL('/search/album', 'https://music.bugs.co.kr/')

    if (options?.keyword){
        url.searchParams.set('q', options.keyword)
        url.searchParams.set('query', options.keyword)
    }

    if (options?.page){
        url.searchParams.set('page', options.page.toString())
    }

    if (options?.pageSize){
        url.searchParams.set('size', options.pageSize.toString())
    }

    const resp = await fetch(url)
    const html = await resp.text()
    const dom = JSDOM.fragment(html)
    const rows = dom.querySelectorAll('ul.albumList li')
    const totalString = dom.querySelector<HTMLAnchorElement>('.tabSearch a.album')?.text
    let total: number = 0

    if (totalString){
        const result = totalString.match(/[0-9]+/ig)
        if (result){
            const _s = result.join('')
            total = Number(_s)
        }
    }

    const result: SearchResultItem[] = []

    for (const item of rows){
        const albumId = item.attributes.getNamedItem('albumid')?.nodeValue
        const artistId = item.attributes.getNamedItem('artistid')?.nodeValue
        const trackId = item.attributes.getNamedItem('trackid')?.nodeValue

        const cover = item.querySelector<HTMLImageElement>(`tr[trackid="${trackId}"] a.thumbnail img`)?.src
        const name = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.title a`)?.text
        const artist = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] p.artist a`)?.text
        const album = item.querySelector<HTMLAnchorElement>(`tr[trackid="${trackId}"] a.album`)?.text

        result.push({
            name,
            artist,
            album,
            cover: cover ? getThumbnail(albumId ? Number(albumId) : 0, 'original') : undefined,
            albumId: Number(albumId) || 0,
            artistId: Number(artistId) || 0,
            trackId: Number(trackId) || 0
        })
    }

    return {
        total,
        items: result
    }
}
