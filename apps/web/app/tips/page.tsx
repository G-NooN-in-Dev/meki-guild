import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import TipsHubSection from '@/features/tips/sections/tips-hub.section'

export const metadata: Metadata = {
	title: '정보 / 팁',
	description: '길드 운영·콘텐츠에 도움이 되는 정보와 팁을 모아둔 공간입니다.'
}

function TipsPage() {
	return (
		<PageShell>
			<TipsHubSection />
		</PageShell>
	)
}

export default TipsPage
