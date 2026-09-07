import guildContentDatesJson from '@/data/guild-content-dates.json'
import dayjs, { formatDate } from '@/utils/dayjs'

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

/** 1 vs 1 비교 테이블 등에서 쓸 컨텐츠 기준일 안내 문구 (최근 수집일 기준) */
function getGuildContentCriteriaLabel(date: string | null): string {
	if (!date) {
		return '기준 : 아직 업데이트 없음'
	}

	return `기준 : ${formatDate(date)}`
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

/** YYYY-MM-DD → UTC 자정 타임스탬프 (요일 계산용) */
function toGuildContentDateTimestamp(date: string): number {
	return dayjs.utc(date, 'YYYY-MM-DD').valueOf()
}

/** 두 수집일 사이의 일수 차이(절댓값) */
function getGuildContentDateDayDiff(left: string, right: string): number {
	return Math.abs(dayjs.utc(left, 'YYYY-MM-DD').diff(dayjs.utc(right, 'YYYY-MM-DD'), 'day'))
}

export {
	formatGuildContentDateOrNone,
	getGuildContentCriteriaLabel,
	getGuildContentDateDayDiff,
	isGuildContentUpdatedThisWeek,
	toGuildContentDateTimestamp
}
export type { GuildContentDateRange, GuildContentDates }
