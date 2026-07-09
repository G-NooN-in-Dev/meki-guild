const KOREAN_UNITS = [
	['경', 10_000_000_000_000_000n],
	['조', 1_000_000_000_000n],
	['억', 100_000_000n],
	['만', 10_000n]
] as const

const TRAINING_KOREAN_FORMAT_THRESHOLD = 10_000_000n

/**
 * bigint 값을 경/조/억/만 단위 문자열로 변환합니다.
 *
 * @example
 * formatKoreanNumber(1739115000000000n) // '1739조 115억'
 */
export function formatKoreanNumber(value: bigint): string {
	if (value === 0n) {
		return '0'
	}

	const isNegative = value < 0n
	const absoluteValue = isNegative ? -value : value
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
		parts.push(remaining.toLocaleString('ko-KR'))
	}

	const formatted = parts.join(' ')

	return isNegative ? `-${formatted}` : formatted
}

/**
 * 증감값을 부호가 포함된 한국어 숫자 문자열로 변환합니다.
 */
export function formatKoreanDelta(diff: bigint): string {
	if (diff === 0n) {
		return '0'
	}

	const sign = diff > 0n ? '+' : '-'

	return `${sign}${formatKoreanNumber(diff > 0n ? diff : -diff)}`
}

/**
 * 수련장 점수 표시용 포맷.
 * 1,000만 미만은 localeString, 1,000만 이상은 경/조/억/만 단위를 사용합니다.
 *
 * @example
 * formatTrainingScore(8158329n)   // '8,158,329'
 * formatTrainingScore(15246720n)  // '1524만 6720'
 */
export function formatTrainingScore(value: bigint): string {
	if (value === 0n) {
		return '0'
	}

	const isNegative = value < 0n
	const absoluteValue = isNegative ? -value : value

	if (absoluteValue < TRAINING_KOREAN_FORMAT_THRESHOLD) {
		return value.toLocaleString('ko-KR')
	}

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
		parts.push(remaining.toString())
	}

	const formatted = parts.join(' ')

	return isNegative ? `-${formatted}` : formatted
}

/**
 * 수련장 점수 증감 표시용 포맷.
 */
export function formatTrainingDelta(diff: bigint): string {
	if (diff === 0n) {
		return '0'
	}

	const sign = diff > 0n ? '+' : '-'

	return `${sign}${formatTrainingScore(diff > 0n ? diff : -diff)}`
}

/**
 * 이전 값 대비 증감 비율(%)을 포맷합니다.
 * 이전 값이 0이면 비율을 계산할 수 없어 null을 반환합니다.
 */
export function formatDeltaPercent(diff: bigint, previous: bigint): string | null {
	if (previous === 0n) {
		return null
	}

	if (diff === 0n) {
		return '0%'
	}

	// 소수점 1자리: (diff / previous) * 100 을 bigint 정수 연산으로 계산
	const scaled = (diff * 1000n) / previous
	const sign = scaled >= 0n ? '+' : '-'
	const absScaled = scaled < 0n ? -scaled : scaled
	const intPart = absScaled / 10n
	const decPart = absScaled % 10n

	return `${sign}${intPart}.${decPart}%`
}
