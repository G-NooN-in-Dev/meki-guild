import guildContentDatesJson from '@/data/guild-content-dates.json'
import { formatDate } from '@/utils/dayjs'

/** 컨텐츠별 최근·직전 수집일 (YYYY-MM-DD). 아직 없으면 null */
type GuildContentDateRange = {
	current: string | null
	previous: string | null
}

type GuildContentDates = {
	combatPower: GuildContentDateRange
	expedition: GuildContentDateRange
	rivalry: GuildContentDateRange
	training: GuildContentDateRange
	guildBoss: GuildContentDateRange
}

/** 길드 컨텐츠별 최근·직전 데이터 수집일 */
export const GUILD_CONTENT_UPDATED_AT = guildContentDatesJson as GuildContentDates

/** 날짜가 없으면 '없음'으로 표시합니다. */
function formatGuildContentDateOrNone(date: string | null): string {
	return date ? formatDate(date) : '없음'
}

/**
 * 이번 주 스냅샷에서 해당 컨텐츠 점수가 갱신됐는지 판별합니다.
 * - 최신 수집일이 없으면 미갱신
 * - 직전일이 없으면(첫 수집) 갱신으로 간주
 * - 둘 다 있으면 current !== previous 일 때만 갱신
 */
function isGuildContentUpdatedThisWeek({ current, previous }: GuildContentDateRange): boolean {
	if (!current) {
		return false
	}

	if (!previous) {
		return true
	}

	return current !== previous
}

export { formatGuildContentDateOrNone, isGuildContentUpdatedThisWeek }
export type { GuildContentDateRange, GuildContentDates }
