import { GUILD_EMPTY_VALUE_LABEL, GUILD_ZERO_DELTA_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { KOREAN_UNITS, TRAINING_KOREAN_FORMAT_THRESHOLD } from '@/utils/korean-number.constants'

/**
 * 숫자를 한국어 locale 천 단위 구분 문자열로 변환합니다.
 *
 * @example
 * formatLocaleNumber(1234) // '1,234'
 * formatLocaleNumber(1234n) // '1,234'
 */
function formatLocaleNumber(value: number | bigint): string {
	return value.toLocaleString('ko-KR')
}

/**
 * 절대값을 해/경/조/억/만 조각으로 나눕니다.
 * `formatRemainder`로 만 미만 나머지 표기만 바꿉니다.
 */
function toKoreanUnitParts(absoluteValue: bigint, formatRemainder: (n: bigint) => string): string[] {
	const parts: string[] = []
	let remaining = absoluteValue

	for (const [unitName, unitValue] of KOREAN_UNITS) {
		if (remaining >= unitValue) {
			const count = remaining / unitValue
			remaining %= unitValue
			parts.push(`${count}${unitName}`)
		}
	}

	if (remaining > 0n) {
		parts.push(formatRemainder(remaining))
	}

	return parts
}

function joinKoreanUnitParts(value: bigint, formatRemainder: (n: bigint) => string): string {
	const isNegative = value < 0n
	const parts = toKoreanUnitParts(isNegative ? -value : value, formatRemainder)
	const formatted = parts.join(' ')

	return isNegative ? `-${formatted}` : formatted
}

/**
 * bigint 값을 해/경/조/억/만 단위 문자열로 변환합니다.
 * 만 미만 나머지는 locale 천 단위 구분입니다.
 *
 * @example
 * formatKoreanNumber(50_000_000n) // '5000만'
 * formatKoreanNumber(1_739_115_000_000_000n) // '1739조 115억'
 * formatKoreanNumber(123_450_000_000_000_000_000n) // '1해 2345경'
 */
function formatKoreanNumber(value: bigint): string {
	if (value === 0n) {
		return '0'
	}

	return joinKoreanUnitParts(value, formatLocaleNumber)
}

/**
 * 단위 포맷. 만 미만 나머지는 콤마 없이 붙입니다. (Sheet·수련장 표시 공통)
 */
function formatKoreanNumberPlain(value: bigint): string {
	if (value === 0n) {
		return '0'
	}

	return joinKoreanUnitParts(value, (n) => n.toString())
}

/**
 * 증감값을 부호가 포함된 한국어 숫자 문자열로 변환합니다.
 */
function formatKoreanDelta(diff: bigint): string {
	if (diff === 0n) {
		return GUILD_ZERO_DELTA_LABEL
	}

	const sign = diff > 0n ? '+' : '-'

	return `${sign}${formatKoreanNumber(diff > 0n ? diff : -diff)}`
}

/**
 * 수련장 점수 표시용 포맷.
 * 1,000만 미만은 localeString, 1,000만 이상은 해/경/조/억/만 단위를 사용합니다.
 *
 * @example
 * formatTrainingScore(8158329n)   // '8,158,329'
 * formatTrainingScore(15246720n)  // '1524만 6720'
 */
function formatTrainingScore(value: bigint): string {
	if (value === 0n) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	const absoluteValue = value < 0n ? -value : value

	if (absoluteValue < TRAINING_KOREAN_FORMAT_THRESHOLD) {
		return formatLocaleNumber(value)
	}

	return formatKoreanNumberPlain(value)
}

/**
 * 수련장 점수 증감 표시용 포맷.
 */
function formatTrainingDelta(diff: bigint): string {
	if (diff === 0n) {
		return GUILD_ZERO_DELTA_LABEL
	}

	const sign = diff > 0n ? '+' : '-'

	return `${sign}${formatTrainingScore(diff > 0n ? diff : -diff)}`
}

/**
 * 토벌전 등수를 `1,234위` 형태로 표시합니다.
 * 미입력이면 빈 값 표기를 반환합니다.
 */
function formatPlacementRank(value: number | null): string {
	if (value === null) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	return `${formatLocaleNumber(value)} 위`
}

/**
 * 이전 값 대비 증감 비율(%)을 포맷합니다.
 * 이전 값이 0이면 비율을 계산할 수 없어 null을 반환합니다.
 */
function formatDeltaPercent(diff: bigint, previous: bigint): string | null {
	if (previous === 0n) {
		return null
	}

	if (diff === 0n) {
		return '0%'
	}

	// 소수점 1자리: (diff / previous) * 100 을 bigint 정수 연산으로 계산
	// 부호는 scaled가 아닌 diff 기준 — 아주 작은 하락이 0으로 잘려도 -0.0%로 표시
	const scaled = (diff * 1000n) / previous
	const sign = diff > 0n ? '+' : '-'
	const absScaled = scaled < 0n ? -scaled : scaled
	const intPart = absScaled / 10n
	const decPart = absScaled % 10n

	return `${sign}${intPart}.${decPart}%`
}

export {
	formatDeltaPercent,
	formatKoreanDelta,
	formatKoreanNumber,
	formatKoreanNumberPlain,
	formatLocaleNumber,
	formatPlacementRank,
	formatTrainingDelta,
	formatTrainingScore
}
