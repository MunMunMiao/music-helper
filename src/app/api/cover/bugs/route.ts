import { getAlbumCover } from '@/lib/bugs'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('album_id')
    if (!albumId) {
        return new Response('album_id is required', {status: 400})
    }

    const result = await getAlbumCover({albumId: Number(albumId)})
    return Response.json(result)
}
