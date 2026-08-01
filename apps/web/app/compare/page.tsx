import type { Metadata } from 'next'

import MemberCompareSection from '@/features/guild/sections/member-compare.section'
import { loadGuildComparePageData } from '@/libs/guild-snapshot.loader'

export const metadata: Metadata = {
	title: '1 vs 1 비교',
	description: '길드원 스펙을 1대1로 비교합니다. 나와 상대방을 선택하면 상세 스펙 비교가 표시됩니다.'
}

function ComparePage() {
	const data = loadGuildComparePageData()

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<MemberCompareSection members={data.members} rankings={data.rankings} />
				</div>
			</main>
		</div>
	)
}

export default ComparePage
