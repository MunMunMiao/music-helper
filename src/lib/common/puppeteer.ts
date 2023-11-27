import edgeChromium from '@sparticuz/chromium-min'
import puppeteer, { Browser } from 'puppeteer-core'

edgeChromium.setHeadlessMode = true
edgeChromium.setGraphicsMode = false

let browser: Browser | undefined

export async function getBrowser(): Promise<Browser> {
    if (browser) {
        return browser
    }

    let executablePath: string = `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

    try {
        executablePath = await edgeChromium.executablePath()
    } catch (e) {
        void 0
    }

    browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        defaultViewport: edgeChromium.defaultViewport,
        headless: edgeChromium.headless,
        timeout: 60000
    })

    return browser
}
