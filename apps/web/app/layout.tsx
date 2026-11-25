import '@/global.css'

import { cn } from '@shared/ui/utils'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import AnnouncementBanner from '@/components/announcement-banner'
import Footer from '@/components/footer'
import Header from '@/components/header'
import ThemeProvider from '@/components/theme-provider'
import ThemedToaster from '@/components/themed-toaster'
import { ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS, hasAnnouncementBanner } from '@/libs/announcement-banner.constants'

// 파비콘·Apple 터치 아이콘·카카오톡 미리보기 모두 public/games.png 사용
const SITE_URL = 'https://meki-games.vercel.app'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: '메이플키우기 게임즈 길드',
		template: '%s | 메이플키우기 게임즈 길드'
	},
	description: '메이플키우기 1서버 게임즈 길드입니다',
	icons: {
		icon: '/games.png',
		apple: '/games.png'
	},
	// title/description은 각 page의 metadata를 쓰고, 여기선 공통 OG만 둡니다.
	openGraph: {
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
	const showAnnouncementBanner = hasAnnouncementBanner()

	return (
		<html lang="ko" className="h-full antialiased" suppressHydrationWarning>
			<body
				className={cn(
					'relative flex min-h-full w-full min-w-0 flex-col pt-14',
					showAnnouncementBanner && ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS
				)}
			>
				<ThemeProvider>
					<div
						aria-hidden
						className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: "url('/games.png')" }}
					/>
					<div aria-hidden className="bg-grayscale-50/80 pointer-events-none fixed inset-0 -z-10 backdrop-blur-[2px]" />
					<Header />
					<AnnouncementBanner />
					{children}
					<Footer />
					<ThemedToaster />
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
