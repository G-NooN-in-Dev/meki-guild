import 'dayjs/locale/ko'

import type { ConfigType, Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko')

/** 앱 기본 타임존 (한국) */
const APP_TIMEZONE = 'Asia/Seoul'

/** 날짜만 표기 기본. 예: 2026.07.05 */
const DEFAULT_DATE_FORMAT = 'YYYY.MM.DD'

/** 일시 표기 기본. 예: 09.03 12:00 */
const DEFAULT_DATETIME_FORMAT = 'MM.DD HH:mm'

/** 날짜+요일+시간 표기. 예: 09.07 (월) 21:59 */
const DATE_WITH_WEEKDAY_FORMAT = 'MM.DD (dd) HH:mm'

dayjs.tz.setDefault(APP_TIMEZONE)

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * 화면용 날짜/일시 포맷.
 * - format 생략 시 `YYYY.MM.DD`
 * - `YYYY-MM-DD`는 날짜 전용으로 파싱
 * - 그 외(ISO 등)는 KST로 변환 후 포맷
 */
function formatDate(date: ConfigType, format: string = DEFAULT_DATE_FORMAT): string {
	if (typeof date === 'string' && DATE_ONLY_PATTERN.test(date)) {
		return dayjs(date, 'YYYY-MM-DD').format(format)
	}

	return dayjs(date).tz(APP_TIMEZONE).format(format)
}

export default dayjs
export { APP_TIMEZONE, DATE_WITH_WEEKDAY_FORMAT, dayjs, DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT, formatDate }
export type { ConfigType, Dayjs }
