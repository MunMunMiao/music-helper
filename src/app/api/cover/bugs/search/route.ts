import { searchSong } from '@/lib/bugs/search'

export const dynamic = 'force-dynamic'

export async function GET(request: Request){
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('page_size')
    const keyword = url.searchParams.get('keyword')
    const source = url.searchParams.get('source')

    switch (source) {
        case '1': {
            const result = await searchSong({page: Number(page) || 1, pageSize: Number(pageSize) || 20, keyword})
            return Response.json(result)
        }
        default:
            return new Response('source is required', {status: 400})
    }
}
