import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import PageShell from '@/components/page-shell'
import { selectContentAwardSlots } from '@/features/guild/lib/select-content-award-winners'
import GuildDetailV2ShellSection from '@/features/guild-v2/sections/guild-detail-v2-shell.section'
import { loadGuildDashboardData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '길드 상세 (미리보기)',
	description: '길드 정보 v2 상세 미리보기입니다. 운영 `/guild`와 분리된 병행 경로입니다.',
	robots: {
		index: false,
		follow: false
	}
}

type GuildV2DetailLayoutProps = {
	children: ReactNode
}

/**
 * 상세 공유 레이아웃.
 * `[section]` 간 이동 시에도 Marquee가 리마운트되지 않도록 셸을 여기에 둡니다.
 */
async function GuildV2DetailLayout({ children }: GuildV2DetailLayoutProps) {
	const { comparisons } = loadGuildDashboardData()
	const awardSlots = selectContentAwardSlots(comparisons)

	return (
		<PageShell>
			<GuildDetailV2ShellSection awardSlots={awardSlots}>{children}</GuildDetailV2ShellSection>
		</PageShell>
	)
}

export default GuildV2DetailLayout
