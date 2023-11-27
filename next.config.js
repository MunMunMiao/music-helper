/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	webpack: (config, { isServer }) => {
		config.externals = {
			'@sparticuz/chromium-min': '@sparticuz/chromium-min',
			'puppeteer-core': 'puppeteer-core'
		}

		return config
	}
}

module.exports = nextConfig
