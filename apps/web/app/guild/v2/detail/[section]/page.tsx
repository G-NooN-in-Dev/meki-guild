import { redirect } from 'next/navigation'

import {
	buildGuildDetailHref,
	GUILD_DETAIL_SECTIONS,
	isGuildDetailSectionId
} from '@/features/guild-v2/lib/guild-detail-nav'
import GuildDetailV2Section from '@/features/guild-v2/sections/guild-detail-v2.section'
import { loadGuildV2DashboardData } from '@/libs/guild-v2-dashboard.loader'
import { loadGuildV2DetailRosterData, loadGuildV2JobClassLineCards } from '@/libs/guild-v2-detail.loader'

type GuildV2DetailPageProps = {
	params: Promise<{ section: string }>
}

export function generateStaticParams() {
	return GUILD_DETAIL_SECTIONS.map((section) => ({ section: section.id }))
}

/** 카드 공통 상세 본문. Marquee·탭은 상위 layout 셸에 있습니다. */
async function GuildV2DetailPage({ params }: GuildV2DetailPageProps) {
	const { section: sectionParam } = await params

	if (!isGuildDetailSectionId(sectionParam)) {
		redirect(buildGuildDetailHref())
	}

	const selectedSection = sectionParam
	const { cards } = loadGuildV2DashboardData()
	const roster = loadGuildV2DetailRosterData()
	const jobClassLineCards = loadGuildV2JobClassLineCards()

	return (
		<GuildDetailV2Section
			selectedSection={selectedSection}
			cards={cards}
			roster={roster}
			jobClassLineCards={jobClassLineCards}
		/>
	)
}

export default GuildV2DetailPage
