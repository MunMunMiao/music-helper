import { getBrowser } from '@/lib/common/puppeteer'

let token: string | null = null

export async function getToken(): Promise<string | null> {
    if (token) {
        return token
    }

    token = await extractToken()

    return token
}

export async function extractToken(): Promise<string | null> {
    let token: string | null = null
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', async request => {
        const type = request.resourceType();
        if (type === 'fetch'){
            const headers = request.headers()
            const authorization = headers['authorization']
            if (authorization){
                token = authorization
            }
        }
        await request.continue()
    })
    await page.goto('https://music.apple.com/browse')
    await page.evaluate(() => {
        const array = document.querySelectorAll<HTMLAnchorElement>(`a[href^="https://music.apple.com"]`)
        let element: HTMLAnchorElement | undefined
        for (const item of array.values()){
            if (/^https:\/\/music.apple.com\/[a-z-_]+\/radio/ig.test(item.href)){
                element = item
            }
        }

        element?.click()
    })
    await page.waitForNetworkIdle()

    await page.close()

    return token
}
