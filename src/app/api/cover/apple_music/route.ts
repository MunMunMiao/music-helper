import { getCover } from '@/lib/bugs/album'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('album_id')
    if (!albumId) {
        return new Response('album_id is required', {status: 400})
    }

    const result = await getCover({albumId: Number(albumId)})
    if (!result?.origin){
        return new Response('cover not found', {status: 404})
    }

    return await fetch(result.origin)
}
