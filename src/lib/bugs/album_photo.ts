export type GetAlbumCoverOptions = {
    albumId: number
    id?: number
}

export type Photo = {
    id: number
    albumId: number
    album_photo_id: number
    url: string
}

type OriginResult = {
    id: number
    priority: number
    album_photo_id: number
    album_id: number
    imageUrl: string
    repres_yn: "Y" | "N"
}[]

export async function getAlbumCover(options: GetAlbumCoverOptions): Promise<Photo | null> {
    const url = new URL('/album/ajax/photoes', 'https://music.bugs.co.kr')
    url.searchParams.set('albumId', options.albumId.toString())

    if (options.id) {
        url.searchParams.set('id', options.id.toString())
    }

    const resp = await fetch(url)
    const data = await resp.json() as unknown as OriginResult
    const photo = data.find(i => i.repres_yn === 'Y')

    if (!photo){
        return null
    }

    return {
        id: photo.id,
        albumId: photo.album_id,
        album_photo_id: photo.album_photo_id,
        url: `https:${photo.imageUrl}`
    }
}
