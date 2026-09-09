import {
	GUILD_SHEET_TAB_LABELS,
	GUILD_SHEET_TAB_WEEKDAY,
	type GuildSheetMemberTab,
	isGuildSheetSeasonalTab
} from '@/features/guild/lib/sheet-form.schema'
import { getSeasonsByContent, type GuildSeasonalContentKey } from '@/libs/guild-content-seasons.constants'
import dayjs, { APP_TIMEZONE, type ConfigType, type Dayjs, formatDate } from '@/utils/dayjs'

type GuildSheetRoundOption = {
	/** Sheet `collectedAt` = 회차 날짜 (YYYY-MM-DD) */
	collectedAt: string
	/** Select 표시 라벨 */
	label: string
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

function isDateWithinSeasonRange(collectedAt: string, startsAt: string, endsAt: string): boolean {
	const date = dayjs.tz(collectedAt, 'YYYY-MM-DD', APP_TIMEZONE).startOf('day')
	const start = dayjs(startsAt).tz(APP_TIMEZONE).startOf('day')
	const end = dayjs(endsAt).tz(APP_TIMEZONE).endOf('day')

	return !date.isBefore(start) && !date.isAfter(end)
}

/**
 * 탭별 이번 회차 후보.
 * - 직전 주(7일 이전 동일 요일)는 넣지 않음 → 최신 요일 날짜 최대 1개
 * - rivalry/training/guildBoss 는 시즌 일정에 존재하는 주차만
 */
function getGuildSheetRoundOptions(tab: GuildSheetMemberTab, nowInput: ConfigType = dayjs()): GuildSheetRoundOption[] {
	const weekday = GUILD_SHEET_TAB_WEEKDAY[tab]
	const collectedDay = getLatestWeekdayOnOrBefore(weekday, nowInput)
	const collectedAt = collectedDay.format('YYYY-MM-DD')
	const dateLabel = formatDate(collectedAt, 'YYYY.MM.DD (dd)')

	if (isGuildSheetSeasonalTab(tab)) {
		const seasons = getSeasonsByContent(tab as GuildSeasonalContentKey)
		const season = seasons.find((item) => isDateWithinSeasonRange(collectedAt, item.startsAt, item.endsAt))

		if (!season) {
			return []
		}

		return [
			{
				collectedAt,
				label: `${season.label} · ${dateLabel}`
			}
		]
	}

	return [
		{
			collectedAt,
			label: `${GUILD_SHEET_TAB_LABELS[tab]} · ${dateLabel}`
		}
	]
}

/** 서버 검증용: 해당 탭의 허용 collectedAt 인지 */
function isAllowedGuildSheetCollectedAt(
	tab: GuildSheetMemberTab,
	collectedAt: string,
	nowInput: ConfigType = dayjs()
): boolean {
	return getGuildSheetRoundOptions(tab, nowInput).some((round) => round.collectedAt === collectedAt)
}

export { getGuildSheetRoundOptions, getLatestWeekdayOnOrBefore, isAllowedGuildSheetCollectedAt }
export type { GuildSheetRoundOption }
