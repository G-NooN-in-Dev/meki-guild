/**
 * 시즌제로 운영되는 길드 컨텐츠 일정.
 * 시간은 한국(KST, UTC+09:00) 기준 ISO 문자열입니다.
 */
import dayjs, { type ConfigType, DATE_WITH_WEEKDAY_FORMAT, formatDate } from '@/utils/dayjs'

type GuildSeasonalContentKey = 'rivalry' | 'training' | 'guildBoss'

type GuildContentSeason = {
	content: GuildSeasonalContentKey
	/** 시즌/회차 표기. 예: 41시즌, 1회차 */
	label: string
	startsAt: string
	endsAt: string
}

type GuildContentSeasonStatus = 'active' | 'upcoming' | 'ended'

type GuildContentSeasonSummary = {
	content: GuildSeasonalContentKey
	contentLabel: string
	status: GuildContentSeasonStatus
	/** 진행·예정 시즌. 종료만 남은 경우 null */
	season: GuildContentSeason | null
	statusLabel: string
	/** 시즌/회차 표기. 종료만 남은 경우 null */
	seasonLabel: string | null
	/** 날짜 핵심 문구 (카드 강조용) */
	dateLabel: string
}

/** 시즌 상태 카드·테이블 row 표면 */
const SEASON_STATUS_CARD_CLASS: Record<GuildContentSeasonStatus, string> = {
	active: 'border-pastel-green-200 bg-pastel-green-50 dark:border-pastel-green-800 dark:bg-pastel-green-950',
	upcoming: 'border-pastel-blue-200 bg-pastel-blue-50 dark:border-pastel-blue-800 dark:bg-pastel-blue-950',
	ended: 'border-grayscale-200 bg-grayscale-50'
}

const SEASON_STATUS_BADGE_CLASS: Record<GuildContentSeasonStatus, string> = {
	active:
		'border-transparent bg-pastel-green-100 text-pastel-green-800 dark:bg-pastel-green-900 dark:text-pastel-green-100',
	upcoming:
		'border-transparent bg-pastel-blue-100 text-pastel-blue-800 dark:bg-pastel-blue-900 dark:text-pastel-blue-100',
	ended: 'border-transparent bg-grayscale-100 text-grayscale-500'
}

/** 시즌 카드 날짜 색 */
const DATE_CLASSNAME: Record<GuildContentSeasonStatus, string> = {
	active: 'text-grayscale-900',
	upcoming: 'text-pastel-blue-800 dark:text-pastel-blue-100',
	ended: 'text-grayscale-500'
}

const GUILD_SEASONAL_CONTENT_META = {
	rivalry: { label: '대항전' },
	training: { label: '수련장' },
	guildBoss: { label: '길드보스' }
} as const satisfies Record<GuildSeasonalContentKey, { label: string }>

/** 대시보드·가이드에 노출하는 시즌제 컨텐츠 순서 */
const GUILD_SEASONAL_CONTENT_ORDER = [
	'rivalry',
	'training',
	'guildBoss'
] as const satisfies readonly GuildSeasonalContentKey[]

const GUILD_CONTENT_SEASON_STATUS_LABEL = {
	active: '진행',
	upcoming: '예정',
	ended: '종료'
} as const satisfies Record<GuildContentSeasonStatus, string>

/** 시즌 일정. 시간은 한국(KST) 기준입니다. */
const GUILD_CONTENT_SEASONS = [
	// 대항전
	{ content: 'rivalry', label: '52시즌', startsAt: '2026-11-19T12:00:00+09:00', endsAt: '2026-11-23T21:59:59+09:00' },
	{ content: 'rivalry', label: '53시즌', startsAt: '2026-11-26T12:00:00+09:00', endsAt: '2026-11-30T21:59:59+09:00' },
	{ content: 'rivalry', label: '54시즌', startsAt: '2026-12-03T12:00:00+09:00', endsAt: '2026-12-07T21:59:59+09:00' },
	{ content: 'rivalry', label: '55시즌', startsAt: '2026-12-10T12:00:00+09:00', endsAt: '2026-12-14T21:59:59+09:00' },
	{ content: 'rivalry', label: '56시즌', startsAt: '2026-12-17T12:00:00+09:00', endsAt: '2026-12-21T21:59:59+09:00' },
	{ content: 'rivalry', label: '57시즌', startsAt: '2026-12-24T12:00:00+09:00', endsAt: '2026-12-28T21:59:59+09:00' },
	{ content: 'rivalry', label: '58시즌', startsAt: '2026-12-31T12:00:00+09:00', endsAt: '2027-01-04T21:59:59+09:00' },
	{ content: 'rivalry', label: '59시즌', startsAt: '2027-01-07T12:00:00+09:00', endsAt: '2027-01-11T21:59:59+09:00' },
	{ content: 'rivalry', label: '60시즌', startsAt: '2027-01-14T12:00:00+09:00', endsAt: '2027-01-18T21:59:59+09:00' },
	{ content: 'rivalry', label: '61시즌', startsAt: '2027-01-21T12:00:00+09:00', endsAt: '2027-01-25T21:59:59+09:00' },
	{ content: 'rivalry', label: '62시즌', startsAt: '2027-01-28T12:00:00+09:00', endsAt: '2027-02-01T21:59:59+09:00' },
	{ content: 'rivalry', label: '63시즌', startsAt: '2027-02-04T12:00:00+09:00', endsAt: '2027-02-08T21:59:59+09:00' },
	{ content: 'rivalry', label: '64시즌', startsAt: '2027-02-11T12:00:00+09:00', endsAt: '2027-02-15T21:59:59+09:00' },
	// 수련장
	{ content: 'training', label: '1회차', startsAt: '2026-11-27T12:00:00+09:00', endsAt: '2026-12-02T21:59:59+09:00' },
	{ content: 'training', label: '2회차', startsAt: '2026-12-04T12:00:00+09:00', endsAt: '2026-12-09T21:59:59+09:00' },
	{ content: 'training', label: '3회차', startsAt: '2026-12-11T12:00:00+09:00', endsAt: '2026-12-16T21:59:59+09:00' },
	// 길드보스
	{ content: 'guildBoss', label: '1회차', startsAt: '2026-11-06T12:00:00+09:00', endsAt: '2026-11-11T21:59:59+09:00' },
	{ content: 'guildBoss', label: '2회차', startsAt: '2026-11-13T12:00:00+09:00', endsAt: '2026-11-18T21:59:59+09:00' },
	{ content: 'guildBoss', label: '3회차', startsAt: '2026-11-20T12:00:00+09:00', endsAt: '2026-11-25T21:59:59+09:00' }
] as const satisfies readonly GuildContentSeason[]

/** 시즌 기간 표기. 예: 09.03 12:00 ~ 09.07 21:59 */
function formatSeasonRange(startsAt: string, endsAt: string): string {
	return `${formatDate(startsAt, DATE_WITH_WEEKDAY_FORMAT)} ~ ${formatDate(endsAt, DATE_WITH_WEEKDAY_FORMAT)}`
}

function getSeasonsByContent(content: GuildSeasonalContentKey): GuildContentSeason[] {
	return GUILD_CONTENT_SEASONS.filter((season) => season.content === content)
}

function getSeasonStatus(season: GuildContentSeason, nowInput: ConfigType = dayjs()): GuildContentSeasonStatus {
	const now = dayjs(nowInput)
	const startsAt = dayjs(season.startsAt)
	const endsAt = dayjs(season.endsAt)

	if (now.isBefore(startsAt)) {
		return 'upcoming'
	}

	if (now.isAfter(endsAt)) {
		return 'ended'
	}

	return 'active'
}

/**
 * 컨텐츠별 현재·다음 시즌 요약.
 * 진행 중 → 가장 가까운 예정 → 종료 순으로 고릅니다.
 */
function getContentSeasonSummary(
	content: GuildSeasonalContentKey,
	nowInput: ConfigType = dayjs()
): GuildContentSeasonSummary {
	const now = dayjs(nowInput)
	const contentLabel = GUILD_SEASONAL_CONTENT_META[content].label
	const seasons = getSeasonsByContent(content)

	const active = seasons.find((season) => getSeasonStatus(season, now) === 'active')

	if (active) {
		return {
			content,
			contentLabel,
			status: 'active',
			season: active,
			statusLabel: GUILD_CONTENT_SEASON_STATUS_LABEL.active,
			seasonLabel: active.label,
			dateLabel: `~ ${formatDate(active.endsAt, DATE_WITH_WEEKDAY_FORMAT)}`
		}
	}

	const upcoming = seasons
		.filter((season) => getSeasonStatus(season, now) === 'upcoming')
		.sort((left, right) => dayjs(left.startsAt).valueOf() - dayjs(right.startsAt).valueOf())[0]

	if (upcoming) {
		return {
			content,
			contentLabel,
			status: 'upcoming',
			season: upcoming,
			statusLabel: GUILD_CONTENT_SEASON_STATUS_LABEL.upcoming,
			seasonLabel: upcoming.label,
			dateLabel: `${formatDate(upcoming.startsAt, DATE_WITH_WEEKDAY_FORMAT)} ~`
		}
	}

	return {
		content,
		contentLabel,
		status: 'ended',
		season: null,
		statusLabel: GUILD_CONTENT_SEASON_STATUS_LABEL.ended,
		seasonLabel: null,
		dateLabel: '시즌 종료'
	}
}

/** 시즌제 컨텐츠 전체 요약 (표시 순서) */
function getGuildContentSeasonSummaries(nowInput: ConfigType = dayjs()): GuildContentSeasonSummary[] {
	return GUILD_SEASONAL_CONTENT_ORDER.map((content) => getContentSeasonSummary(content, nowInput))
}

export {
	DATE_CLASSNAME,
	formatSeasonRange,
	getContentSeasonSummary,
	getGuildContentSeasonSummaries,
	getSeasonsByContent,
	getSeasonStatus,
	GUILD_CONTENT_SEASON_STATUS_LABEL,
	GUILD_SEASONAL_CONTENT_META,
	GUILD_SEASONAL_CONTENT_ORDER,
	SEASON_STATUS_BADGE_CLASS,
	SEASON_STATUS_CARD_CLASS
}
export type { GuildContentSeason, GuildContentSeasonSummary, GuildSeasonalContentKey }
