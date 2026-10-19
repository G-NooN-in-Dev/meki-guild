import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		unoptimized: true
	},
	async redirects() {
		return [
			{
				source: '/tips/guild-expedition-hit-cut',
				destination: '/tips/guild-expedition',
				permanent: true
			},
			{
				source: '/tips/guild-rivalry-hit-cut',
				destination: '/tips/guild-rivalry',
				permanent: true
			},
			{
				source: '/tips/guild-training-info',
				destination: '/tips/guild-training',
				permanent: true
			}
		]
	}
}

export default nextConfig
