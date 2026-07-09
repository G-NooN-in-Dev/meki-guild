import guildContentDatesJson from '@/data/guild-content-dates.json'

/** 길드 컨텐츠별 최근 데이터 수집일 (YYYY-MM-DD). 없으면 null */
export const GUILD_CONTENT_UPDATED_AT = guildContentDatesJson

/** 컨텐츠 업데이트일을 화면 표기용(2026.07.05)으로 변환합니다. */
export function formatGuildContentDate(date: string): string {
	const [year, month, day] = date.split('-')
	return `${year}.${month}.${day}`
}

/** 툴팁·헤더에 쓸 컨텐츠 업데이트 안내 문구 */
export function getGuildContentUpdatedAtLabel(date: string | null): string {
	return `최근 업데이트 : ${date ? formatGuildContentDate(date) : '없음'}`
}

/** 1 vs 1 비교 테이블 등에서 쓸 컨텐츠 기준일 안내 문구 */
export function getGuildContentCriteriaLabel(date: string | null): string {
	if (!date) {
		return '기준 : 아직 업데이트 없음'
	}

	return `기준 : ${formatGuildContentDate(date)}`
}
