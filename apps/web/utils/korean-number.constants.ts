/** 수련장: 이 값 이상이면 게임·Sheet 모두 단위 표기 */
const TRAINING_KOREAN_FORMAT_THRESHOLD = 10_000_000n

/**
 * 큰 단위 → 작은 단위. 배수·포맷 순서의 단일 소스입니다.
 * 해(10²⁰) · 경(10¹⁶) · 조(10¹²) · 억(10⁸) · 만(10⁴)
 */
const KOREAN_UNITS = [
	['해', 100_000_000_000_000_000_000n],
	['경', 10_000_000_000_000_000n],
	['조', 1_000_000_000_000n],
	['억', 100_000_000n],
	['만', 10_000n]
] as const

type KoreanUnit = (typeof KOREAN_UNITS)[number][0]

const KOREAN_UNIT_MULTIPLIERS = Object.fromEntries(KOREAN_UNITS) as {
	readonly [K in KoreanUnit]: bigint
}

/** 정규식 대안 (`해|경|조|억|만`) — 단위 추가 시 KOREAN_UNITS만 수정 */
const KOREAN_UNIT_ALT = KOREAN_UNITS.map(([name]) => name).join('|')
/** 문자 클래스용 (`해경조억만`) */
const KOREAN_UNIT_CHARS = KOREAN_UNITS.map(([name]) => name).join('')

export { KOREAN_UNIT_ALT, KOREAN_UNIT_CHARS, KOREAN_UNIT_MULTIPLIERS, KOREAN_UNITS, TRAINING_KOREAN_FORMAT_THRESHOLD }
export type { KoreanUnit }
