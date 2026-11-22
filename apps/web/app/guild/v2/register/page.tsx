import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GuildRegisterV2Section from '@/features/guild-v2/sections/guild-register-v2.section'
import { loadGuildDashboardData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '데이터 등록 (미리보기)',
	description: '길드 정보 v2 데이터 등록 미리보기입니다. 운영 `/guild`와 분리된 병행 경로입니다.',
	robots: {
		index: false,
		follow: false
	}
}

/** 병행 리뉴얼 경로. 부모 `app/guild/layout`의 비밀번호 게이트·실명 공개를 그대로 상속합니다. */
function GuildV2RegisterPage() {
	const { comparisons, currentWeek } = loadGuildDashboardData()

	const members = comparisons
		.filter((comparison) => comparison.status !== 'left')
		.map((comparison) => ({
			name: comparison.name,
			job: comparison.job,
			combatPowerLabel: comparison.combatPower.currentLabel
		}))

	return (
		<PageShell>
			{/* 다음 회차 프리필 = 동기화된 최신 주(current). previousWeek는 대시보드 비교용 */}
			<GuildRegisterV2Section members={members} previousMembers={currentWeek.members} />
		</PageShell>
	)
}

export default GuildV2RegisterPage
