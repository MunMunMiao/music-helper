import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx,css}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx,css}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx,css}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx,css}'
    ],
    theme: {
        extend: {}
    },
    plugins: [nextui()]
}
export default config
