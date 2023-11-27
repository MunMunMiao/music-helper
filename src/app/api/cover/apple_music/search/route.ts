import { getToken } from '@/lib/apple_music/extract_token'


export async function GET(request: Request){
    const token = await getToken()
    return new Response(token)
}
