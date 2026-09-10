import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GuildDashboardSection from '@/features/guild/sections/guild-dashboard.section'
import { loadGuildDashboardData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '길드 정보',
	description: '메이플키우기 1서버 게임즈 길드 대시보드입니다. 주간 스냅샷·멤버 현황을 확인하세요.'
}

function GuildPage() {
	const data = loadGuildDashboardData()

	return (
		<PageShell>
			<GuildDashboardSection data={data} />
		</PageShell>
	)
}

export default GuildPage
