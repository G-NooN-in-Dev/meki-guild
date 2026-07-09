/**
 * ISO 주차 라벨(예: 2026-W28, W28)을 화면용 한글 주차 표기로 변환합니다.
 *
 * @example
 * formatWeekLabel('2026-W28') // '2026년 28주차'
 * formatWeekLabel('W27')      // '27주차'
 */
export function formatWeekLabel(weekLabel: string): string {
	const isoWeekMatch = weekLabel.match(/^(?:(\d{4})-)?W(\d{1,2})$/i)

	if (!isoWeekMatch) {
		return weekLabel
	}

	const [, year, week] = isoWeekMatch
	const weekNumber = Number(week)

	if (year) {
		return `${year}년 ${weekNumber}주차`
	}

	return `${weekNumber}주차`
}
