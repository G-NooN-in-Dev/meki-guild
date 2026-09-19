import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'mgf.gg',
				pathname: '/ranking/**'
			}
		]
	},
	async redirects() {
		return [
			{
				source: '/compare',
				destination: '/guild/compare',
				permanent: true
			}
		]
	}
}

export default nextConfig
