import puppeteer, { Browser } from 'puppeteer-core'
import * as process from 'process'

let browser: Browser | undefined

export async function getBrowser(): Promise<Browser | undefined> {
    const endpoint = process.env.PUPPETEER_ENDPOINT as string | undefined

    if (endpoint) {
        return undefined
    }

    if (browser) {
        return browser
    }

    browser = await puppeteer.connect({
        browserWSEndpoint: process.env.PUPPETEER_ENDPOINT,
        protocolTimeout: 60000
    })
    return browser
}
