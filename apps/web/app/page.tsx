import type { Metadata } from 'next'

import GuildDashboardSection from '@/features/guild/sections/guild-dashboard.section'
import { loadGuildDashboardData } from '@/libs/guild-snapshot.loader'

// 루트 title.template이 붙지 않도록 absolute로 기본 사이트 제목을 유지합니다.
export const metadata: Metadata = {
	title: {
		absolute: '메이플키우기 게임즈 길드'
	},
	description: '메이플키우기 1서버 게임즈 길드 대시보드입니다. 주간 스냅샷·멤버 현황을 확인하세요.'
}

function Homepage() {
	const data = loadGuildDashboardData()

	return (
		<div className="min-h-screen-safe flex w-full min-w-0 flex-1 font-sans">
			<main className="flex w-full min-w-0 flex-1">
				<div className="max-w-content container mx-auto flex w-full min-w-0 flex-col px-4 py-8 md:px-6">
					<GuildDashboardSection data={data} />
				</div>
			</main>
		</div>
	)
}

export default Homepage
