import { searchSong } from '@/lib/bugs'

export async function GET(request: Request){
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('page_size')
    const keyword = url.searchParams.get('keyword')
    const type = url.searchParams.get('type')

    switch (type) {
        case '1':
            break
    }

    const result = await searchSong({page: Number(page) || 1, pageSize: Number(pageSize) || 50, keyword})
    return Response.json(result)
}
