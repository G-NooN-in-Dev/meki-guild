import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import SiteHubSection from '@/features/home/sections/site-hub.section'

// 루트 title.template이 붙지 않도록 absolute로 기본 사이트 제목을 유지합니다.
export const metadata: Metadata = {
	title: {
		absolute: '메이플키우기 게임즈 길드'
	},
	description: '메이플키우기 1서버 게임즈 길드입니다. 길드 정보와 정보/팁을 선택해 이용하세요.'
}

function Homepage() {
	return (
		<PageShell>
			<SiteHubSection />
		</PageShell>
	)
}

export default Homepage
