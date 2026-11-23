import type { GuildDashboardChartCardId } from '@/features/guild/types/guild-dashboard.type'

/** 상세 페이지에서 선택 가능한 항목. 대시보드 카드 id와 동일합니다. */
const GUILD_DETAIL_SECTIONS = [
	{ id: 'overview', title: '전투력·레벨' },
	{ id: 'jobs', title: '직업' },
	{ id: 'bounty', title: '현상수배' },
	{ id: 'expedition', title: '토벌전' },
	{ id: 'rivalry', title: '대항전' },
	{ id: 'training', title: '수련장' },
	{ id: 'guild-boss', title: '길드보스' }
] as const satisfies ReadonlyArray<{ id: GuildDashboardChartCardId; title: string }>

const GUILD_DETAIL_PATH = '/guild/detail'
const GUILD_REGISTER_PATH = '/guild/register'
const DEFAULT_GUILD_DETAIL_SECTION: GuildDashboardChartCardId = 'overview'

const SECTION_IDS = new Set<string>(GUILD_DETAIL_SECTIONS.map((section) => section.id))

function isGuildDetailSectionId(value: string): value is GuildDashboardChartCardId {
	return SECTION_IDS.has(value)
}

/** path 세그먼트·상태용 section 값을 검증합니다. 없거나 잘못된 값이면 기본 항목으로 둡니다. */
function parseGuildDetailSection(value: string | null | undefined): GuildDashboardChartCardId {
	if (value && isGuildDetailSectionId(value)) {
		return value
	}
	return DEFAULT_GUILD_DETAIL_SECTION
}

function getGuildDetailSectionTitle(id: GuildDashboardChartCardId): string {
	const found = GUILD_DETAIL_SECTIONS.find((section) => section.id === id)
	return found?.title ?? id
}

/** 상세 경로. section 이 없으면 기본 항목 세그먼트로 둡니다. */
function buildGuildDetailHref(section?: GuildDashboardChartCardId): string {
	return `${GUILD_DETAIL_PATH}/${section ?? DEFAULT_GUILD_DETAIL_SECTION}`
}

export {
	buildGuildDetailHref,
	DEFAULT_GUILD_DETAIL_SECTION,
	getGuildDetailSectionTitle,
	GUILD_DETAIL_PATH,
	GUILD_DETAIL_SECTIONS,
	GUILD_REGISTER_PATH,
	isGuildDetailSectionId,
	parseGuildDetailSection
}
