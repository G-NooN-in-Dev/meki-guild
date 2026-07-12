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

/** 툴팁·헤더에 쓸 컨텐츠 업데이트 안내 문구 (최근 + 직전) */
export function getGuildContentUpdatedAtLines(dates: GuildContentDateRange): {
	current: string
	previous: string
} {
	return {
		current: `최근 업데이트 : ${formatGuildContentDateOrNone(dates.current)}`,
		previous: `직전 업데이트 : ${formatGuildContentDateOrNone(dates.previous)}`
	}
}

/** 1 vs 1 비교 테이블 등에서 쓸 컨텐츠 기준일 안내 문구 (최근 수집일 기준) */
export function getGuildContentCriteriaLabel(date: string | null): string {
	if (!date) {
		return '기준 : 아직 업데이트 없음'
	}

	return `기준 : ${formatGuildContentDate(date)}`
}
