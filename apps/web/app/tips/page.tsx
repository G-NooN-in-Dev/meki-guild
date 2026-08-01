import type { Metadata } from 'next'

import TipsHubSection from '@/features/tips/sections/tips-hub.section'

export const metadata: Metadata = {
	title: '정보 / 팁',
	description: '길드 운영·콘텐츠에 도움이 되는 정보와 팁을 모아둔 공간입니다.'
}

function TipsPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<TipsHubSection />
				</div>
			</main>
		</div>
	)
}

export default TipsPage
