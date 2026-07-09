import '@/global.css'

import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

export const metadata: Metadata = {
	title: {
		default: '메이플키우기 게임즈 길드',
		template: '%s | 메이플키우기 게임즈 길드'
	},
	description: '메이플키우기 게임즈 길드'
}

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="relative flex min-h-full w-full flex-col pt-14">
				<div
					aria-hidden
					className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: "url('/games.png')" }}
				/>
				<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/78 backdrop-blur-[2px]" />
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	)
}

export default RootLayout
