import MemberCompareSection from '@/features/guild/sections/member-compare.section'
import { loadGuildComparePageData } from '@/libs/guild-snapshot.loader'

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
