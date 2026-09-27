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
	}
}

export default nextConfig
