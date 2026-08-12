import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		unoptimized: true
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
