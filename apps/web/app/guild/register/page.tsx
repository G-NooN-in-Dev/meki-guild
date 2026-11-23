import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GuildRegisterSection from '@/features/guild/sections/guild-register.section'
import { loadGuildSnapshotData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '데이터 등록',
	description: '길드 주간 데이터를 등록합니다.'
}

function GuildRegisterPage() {
	const { comparisons, currentWeek } = loadGuildSnapshotData()

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
			<GuildRegisterSection members={members} previousMembers={currentWeek.members} />
		</PageShell>
	)
}

export default GuildRegisterPage
