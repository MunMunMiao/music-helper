import { searchSong } from '@/lib/bugs/search'
import { throwError } from '@/lib/common/error'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const pageSize = url.searchParams.get('page_size')
    const keyword = url.searchParams.get('keyword')

    if (!keyword) {
        return throwError(new Error('Invalid keyword'))
    }

    const result = await searchSong({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 20,
        keyword
    })
    return Response.json(result)
}
