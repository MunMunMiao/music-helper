import { getImageSource } from '@/lib/bugs/image'

export type GetCoverOptions = {
    albumId: number
    id?: number
    quality?: number | 'original'
}

export type Photo = {
    id: number
    albumId: number
    origin: string
    cover: string
}

type OriginResult = {
    id: number
    priority: number
    album_photo_id: number
    album_id: number
    imageUrl: string
    repres_yn: 'Y' | 'N'
}[]

export async function getCover(options: GetCoverOptions): Promise<Photo | null> {
    const url = new URL('/album/ajax/photoes', 'https://music.bugs.co.kr')
    url.searchParams.set('albumId', options.albumId.toString())

    if (options.id) {
        url.searchParams.set('id', options.id.toString())
    }

    const resp = await fetch(url)
    const data = await resp.json() as unknown as OriginResult
    const photo = data.find(i => i.repres_yn === 'Y')

    if (!photo) {
        return null
    }

    const origin = `https:${photo.imageUrl}`
    const cover = getImageSource(origin, options.quality)

    return {
        id: photo.id,
        albumId: photo.album_id,
        origin,
        cover
    }
}
