import { redirect } from 'next/navigation'

import {
	buildGuildDetailHref,
	GUILD_DETAIL_SECTIONS,
	isGuildDetailSectionId
} from '@/features/guild/lib/guild-detail-nav'
import GuildDetailSection from '@/features/guild/sections/guild-detail.section'
import { loadGuildDashboardData } from '@/libs/guild-dashboard.loader'
import { loadGuildDetailRosterData, loadGuildJobClassLineCards } from '@/libs/guild-detail.loader'

type GuildDetailPageProps = {
	params: Promise<{ section: string }>
}

export function generateStaticParams() {
	return GUILD_DETAIL_SECTIONS.map((section) => ({ section: section.id }))
}

/** 카드 공통 상세 본문. Marquee·탭은 상위 layout 셸에 있습니다. */
async function GuildDetailPage({ params }: GuildDetailPageProps) {
	const { section: sectionParam } = await params

	if (!isGuildDetailSectionId(sectionParam)) {
		redirect(buildGuildDetailHref())
	}

	const selectedSection = sectionParam
	const { cards } = loadGuildDashboardData()
	const roster = loadGuildDetailRosterData()
	const jobClassLineCards = loadGuildJobClassLineCards()

	return (
		<GuildDetailSection
			selectedSection={selectedSection}
			cards={cards}
			roster={roster}
			jobClassLineCards={jobClassLineCards}
		/>
	)
}

export default GuildDetailPage
