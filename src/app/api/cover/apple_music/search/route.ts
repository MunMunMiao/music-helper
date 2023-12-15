import { throwError } from '@/lib/common/error'
import { search, SearchOptions } from '@/lib/apple_music/search'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const groups = searchParams.get('groups')
    const offset = searchParams.get('offset')
    const limit = searchParams.get('limit')
    const options: SearchOptions = {
        groups: 'album',
        keyword: searchParams.get('keyword'),
        offset: offset ? Number(offset) : undefined,
        limit: limit ? Number(limit) : undefined,
    }

    if (options.limit) {
        if (options.limit <= 0 || options.limit > 50){
            return throwError(new Error('Invalid limit'))
        }
    }else {
        return throwError(new Error('Invalid limit'))
    }

    switch (groups) {
        case 'song':
        case 'album':
            options.groups = groups
            break
        default:
            return throwError(new Error('Invalid groups'))
    }

    const result = await search(options)
    return Response.json(result)
}
