import '@/global.css'

import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
	title: {
		default: 'Meki Guild',
		template: '%s | Meki Guild'
	},
	description: 'Meki Guild'
}

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="bg-grayscale-100 flex min-h-full w-full flex-col">{children}</body>
		</html>
	)
}

export default RootLayout
