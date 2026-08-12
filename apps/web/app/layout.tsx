import '@/global.css'

import { Toaster } from '@shared/ui/sonner'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import { BgmProvider } from '@/components/bgm.context'
import Footer from '@/components/footer'
import Header from '@/components/header'

// 카카오톡 등 링크 미리보기용 Open Graph 메타
const SITE_URL = 'https://meki-games.vercel.app'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: '메이플키우기 게임즈 길드',
		template: '%s | 메이플키우기 게임즈 길드'
	},
	description: '메이플키우기 1서버 게임즈 길드입니다',
	openGraph: {
		title: '메이플키우기 게임즈 길드',
		description: '메이플키우기 1서버 게임즈 길드입니다',
		url: SITE_URL,
		siteName: '메이플키우기 게임즈 길드',
		images: [
			{
				url: '/games.png',
				alt: '메이플키우기 게임즈 길드'
			}
		],
		locale: 'ko_KR',
		type: 'website'
	}
}

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="relative flex min-h-full w-full min-w-0 flex-col pt-14">
				<div
					aria-hidden
					className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: "url('/games.png')" }}
				/>
				<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/78 backdrop-blur-[2px]" />
				{/* 헤더·모바일 Sheet에서 같은 BGM 재생 상태를 공유 */}
				<BgmProvider>
					<Header />
					{children}
					<Footer />
					<Toaster />
				</BgmProvider>
			</body>
		</html>
	)
}

export default RootLayout
