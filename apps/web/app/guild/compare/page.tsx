import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import MemberCompareSection from '@/features/guild/sections/member-compare.section'
import { loadGuildComparePageData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '1 vs 1 비교',
	description: '길드원 스펙을 1대1로 비교합니다. 나와 상대방을 선택하면 상세 스펙 비교가 표시됩니다.'
}

function GuildComparePage() {
	const data = loadGuildComparePageData()

	return (
		<PageShell>
			<MemberCompareSection members={data.members} rankings={data.rankings} />
		</PageShell>
	)
}

export default GuildComparePage
