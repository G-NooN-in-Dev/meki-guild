import guildContentDatesJson from '@/data/guild-content-dates.json'

/** 컨텐츠별 최근·직전 수집일 (YYYY-MM-DD). 아직 없으면 null */
export type GuildContentDateRange = {
	current: string | null
	previous: string | null
}

export type GuildContentDates = {
	combatPower: GuildContentDateRange
	expedition: GuildContentDateRange
	rivalry: GuildContentDateRange
	training: GuildContentDateRange
	guildBoss: GuildContentDateRange
}

/** 길드 컨텐츠별 최근·직전 데이터 수집일 */
export const GUILD_CONTENT_UPDATED_AT = guildContentDatesJson as GuildContentDates

/** 컨텐츠 업데이트일을 화면 표기용(2026.07.05)으로 변환합니다. */
export function formatGuildContentDate(date: string): string {
	const [year, month, day] = date.split('-')
	return `${year}.${month}.${day}`
}

/** 날짜가 없으면 '없음'으로 표시합니다. */
export function formatGuildContentDateOrNone(date: string | null): string {
	return date ? formatGuildContentDate(date) : '없음'
}

/** 1 vs 1 비교 테이블 등에서 쓸 컨텐츠 기준일 안내 문구 (최근 수집일 기준) */
export function getGuildContentCriteriaLabel(date: string | null): string {
	if (!date) {
		return '기준 : 아직 업데이트 없음'
	}

	return `기준 : ${formatGuildContentDate(date)}`
}

/**
 * 이번 주 스냅샷에서 해당 컨텐츠 점수가 갱신됐는지 판별합니다.
 * - 최신 수집일이 없으면 미갱신
 * - 직전일이 없으면(첫 수집) 갱신으로 간주
 * - 둘 다 있으면 current !== previous 일 때만 갱신
 */
export function isGuildContentUpdatedThisWeek({ current, previous }: GuildContentDateRange): boolean {
	if (!current) {
		return false
	}

	if (!previous) {
		return true
	}

	return current !== previous
}

/** YYYY-MM-DD → UTC 자정 타임스탬프 (요일 계산용) */
export function toGuildContentDateTimestamp(date: string): number {
	const [yearText, monthText, dayText] = date.split('-')
	const year = Number(yearText)
	const month = Number(monthText)
	const day = Number(dayText)

	return Date.UTC(year, month - 1, day)
}

/** 두 수집일 사이의 일수 차이(절댓값) */
export function getGuildContentDateDayDiff(left: string, right: string): number {
	const msPerDay = 24 * 60 * 60 * 1000
	return Math.abs(toGuildContentDateTimestamp(left) - toGuildContentDateTimestamp(right)) / msPerDay
}
