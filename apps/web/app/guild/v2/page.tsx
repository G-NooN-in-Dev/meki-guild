import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GuildDashboardV2Section from '@/features/guild-v2/sections/guild-dashboard-v2.section'
import { loadGuildV2DashboardData } from '@/libs/guild-v2-dashboard.loader'

export const metadata: Metadata = {
	title: '길드 정보 (미리보기)',
	description: '길드 정보 페이지 v2 미리보기입니다. 운영 `/guild`와 분리된 병행 경로입니다.',
	robots: {
		index: false,
		follow: false
	}
}

/** 병행 리뉴얼 경로. 부모 `app/guild/layout`의 비밀번호 게이트·실명 공개를 그대로 상속합니다. */
function GuildV2Page() {
	const data = loadGuildV2DashboardData()

	return (
		<PageShell>
			<GuildDashboardV2Section data={data} />
		</PageShell>
	)
}

export default GuildV2Page
