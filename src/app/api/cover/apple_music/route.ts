export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    if (!url) {
        return new Response('url is required', {status: 400})
    }

    return await fetch(url)
}
