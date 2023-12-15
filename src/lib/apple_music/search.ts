import * as process from 'process'

export interface SearchOptions {
    groups: 'song' | 'album'
    keyword?: string | null
    offset?: number | null
    limit?: number | null
}

export type SearchResult = {
    songName: string
    albumName: string
    artistName: string
    artwork: {
        width: number
        height: number
        url: string
    }
}

type OriginSearchAlbum = {
    id: string
    type: 'albums'
    attributes: {
        name: string
        artistName: string
        artwork: {
            width: number
            height: number
            url: string
        }
    }
}

type OriginSearchSong = {
    id: string
    type: 'songs'
    attributes: {
        name: string
        albumName: string
        artistName: string
        artwork: {
            width: number
            height: number
            url: string
        }
    }
}

type OriginSearchResult = {
    results?: {
        album: {
            groupId: 'song' | 'album'
            data: OriginSearchAlbum[]
        },
        song: {
            groupId: 'song' | 'album'
            data: OriginSearchSong[]
        }
    }
}

export async function search(options: SearchOptions): Promise<SearchResult[]> {
    const url: URL = new URL('https://amp-api.music.apple.com/v1/catalog/cn/search')
    url.searchParams.set('groups', options.groups)
    url.searchParams.set('fields[albums]', 'artistName,artwork,name')
    url.searchParams.set('types', 'albums,songs')
    url.searchParams.set('with', 'serverBubbles')

    if (options?.keyword) {
        url.searchParams.set('term', options.keyword)
    }

    if (options?.offset) {
        url.searchParams.set('offset', options.offset.toString())
    }

    if (options?.limit) {
        url.searchParams.set('limit', options.limit.toString())
    }

    const resp = await fetch(url, {
        headers: {
            origin: 'https://music.apple.com',
            referer: 'https://music.apple.com',
            authorization: process.env.APPLE_MUSIC_AUTHORIZATION as string
        }
    })
    const json: OriginSearchResult = await resp.json()
    let result: SearchResult[] = []

    switch (options.groups) {
        case 'album': {
            const array = json.results?.album.data ?? []
            result = array.map(item => ({
                songName: '',
                albumName: item.attributes.name,
                artistName: item.attributes.artistName,
                artwork: {
                    width: item.attributes.artwork.width,
                    height: item.attributes.artwork.height,
                    url: item.attributes.artwork.url
                }
            }))
            break
        }
        case 'song': {
            const array = json.results?.song.data ?? []
            result = array.map(item => ({
                songName: item.attributes.name,
                albumName: item.attributes.albumName,
                artistName: item.attributes.artistName,
                artwork: {
                    width: item.attributes.artwork.width,
                    height: item.attributes.artwork.height,
                    url: item.attributes.artwork.url
                }
            }))
            break
        }
    }

    return result
}
