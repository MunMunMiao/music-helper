/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	webpack: (config, { isServer }) => {
		config.externals = [
			...config.externals,
			'puppeteer-core',
		]

		return config
	}
}

module.exports = nextConfig
