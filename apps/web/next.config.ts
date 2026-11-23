import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		unoptimized: true
	},
	async redirects() {
		return []
	}
}

export default nextConfig
