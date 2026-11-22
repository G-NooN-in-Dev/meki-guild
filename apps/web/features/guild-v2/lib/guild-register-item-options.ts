import {
	GUILD_SHEET_MEMBER_TABS,
	GUILD_SHEET_TAB_LABELS,
	GUILD_SHEET_TAB_WEEKDAY,
	type GuildSheetMemberTab,
	isGuildSheetSeasonalTab
} from '@/features/guild/lib/sheet-form.schema'
import { getSeasonsByContent, type GuildSeasonalContentKey } from '@/libs/guild-content-seasons.constants'
import dayjs, { APP_TIMEZONE, type ConfigType, type Dayjs, formatDate } from '@/utils/dayjs'

type GuildRegisterItemOption = {
	tab: GuildSheetMemberTab
	/** Sheet `collectedAt` = 회차 날짜 (YYYY-MM-DD) */
	collectedAt: string
	/** Select 표시: 항목명 · (회차) · 날짜 */
	label: string
	/** 회차 날짜가 오늘(KST)보다 뒤면 true */
	disabled: boolean
}

function toKstDay(nowInput: ConfigType = dayjs()): Dayjs {
	return dayjs(nowInput).tz(APP_TIMEZONE).startOf('day')
}

/** 오늘 포함, 해당 요일의 가장 최근 날짜 */
function getLatestWeekdayOnOrBefore(weekday: number, nowInput: ConfigType = dayjs()): Dayjs {
	let cursor = toKstDay(nowInput)

	while (cursor.day() !== weekday) {
		cursor = cursor.subtract(1, 'day')
	}

	return cursor
}

/** 오늘 포함, 해당 요일의 가장 가까운 다음 날짜 */
function getNextWeekdayOnOrAfter(weekday: number, nowInput: ConfigType = dayjs()): Dayjs {
	let cursor = toKstDay(nowInput)

	while (cursor.day() !== weekday) {
		cursor = cursor.add(1, 'day')
	}

	return cursor
}

function isDateWithinSeasonRange(collectedAt: string, startsAt: string, endsAt: string): boolean {
	const date = dayjs.tz(collectedAt, 'YYYY-MM-DD', APP_TIMEZONE).startOf('day')
	const start = dayjs(startsAt).tz(APP_TIMEZONE).startOf('day')
	const end = dayjs(endsAt).tz(APP_TIMEZONE).endOf('day')

	return !date.isBefore(start) && !date.isAfter(end)
}

/** 시즌·요일에 맞는 회차면 라벨, 아니면 null (숨김) */
function buildItemLabel(tab: GuildSheetMemberTab, collectedAt: string): string | null {
	const dateLabel = formatDate(collectedAt, 'YYYY.MM.DD (dd)')
	const tabLabel = GUILD_SHEET_TAB_LABELS[tab]

	if (isGuildSheetSeasonalTab(tab)) {
		const seasons = getSeasonsByContent(tab as GuildSeasonalContentKey)
		const season = seasons.find((item) => isDateWithinSeasonRange(collectedAt, item.startsAt, item.endsAt))

		if (!season) {
			return null
		}

		return `${tabLabel} · ${season.label} · ${dateLabel}`
	}

	return `${tabLabel} · ${dateLabel}`
}

/**
 * 탭 1개의 등록 항목 후보.
 * - 오늘 이전·당일 회차가 유효하면 활성
 * - 없고 미래 회차만 유효하면 disabled 로 노출
 * - 둘 다 없으면 null (Select에서 숨김)
 */
function resolveRegisterItemOption(
	tab: GuildSheetMemberTab,
	nowInput: ConfigType = dayjs()
): GuildRegisterItemOption | null {
	const weekday = GUILD_SHEET_TAB_WEEKDAY[tab]
	const today = toKstDay(nowInput)

	const pastOrToday = getLatestWeekdayOnOrBefore(weekday, nowInput)
	const pastCollectedAt = pastOrToday.format('YYYY-MM-DD')
	const pastLabel = buildItemLabel(tab, pastCollectedAt)

	if (pastLabel) {
		return {
			tab,
			collectedAt: pastCollectedAt,
			label: pastLabel,
			disabled: false
		}
	}

	const upcoming = getNextWeekdayOnOrAfter(weekday, nowInput)

	if (upcoming.isSame(pastOrToday, 'day')) {
		return null
	}

	const upcomingCollectedAt = upcoming.format('YYYY-MM-DD')
	const upcomingLabel = buildItemLabel(tab, upcomingCollectedAt)

	if (!upcomingLabel) {
		return null
	}

	return {
		tab,
		collectedAt: upcomingCollectedAt,
		label: upcomingLabel,
		disabled: upcoming.isAfter(today)
	}
}

/** 회차 정보가 있는 항목만 반환. 미래 회차는 disabled. */
function getGuildRegisterItemOptions(nowInput: ConfigType = dayjs()): GuildRegisterItemOption[] {
	const options: GuildRegisterItemOption[] = []

	for (const tab of GUILD_SHEET_MEMBER_TABS) {
		const option = resolveRegisterItemOption(tab, nowInput)

		if (option) {
			options.push(option)
		}
	}

	return options
}

export { getGuildRegisterItemOptions }
export type { GuildRegisterItemOption }
