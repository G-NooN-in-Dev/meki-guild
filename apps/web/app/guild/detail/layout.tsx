import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import PageShell from '@/components/page-shell'
import { selectContentAwardSlots } from '@/features/guild/lib/select-content-award-winners'
import GuildDetailShellSection from '@/features/guild/sections/guild-detail-shell.section'
import { loadGuildSnapshotData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '길드 상세',
	description: '길드 멤버별 주간 상세 현황입니다.'
}

type GuildDetailLayoutProps = {
	children: ReactNode
}

/**
 * 상세 공유 레이아웃.
 * `[section]` 간 이동 시에도 Marquee가 리마운트되지 않도록 셸을 여기에 둡니다.
 */
async function GuildDetailLayout({ children }: GuildDetailLayoutProps) {
	const { comparisons } = loadGuildSnapshotData()
	const awardSlots = selectContentAwardSlots(comparisons)

	return (
		<PageShell>
			<GuildDetailShellSection awardSlots={awardSlots}>{children}</GuildDetailShellSection>
		</PageShell>
	)
}

export default GuildDetailLayout
