/** 수련장: 이 값 이상이면 게임·Sheet 모두 단위 표기 */
const TRAINING_KOREAN_FORMAT_THRESHOLD = 10_000_000n

const KOREAN_UNIT_MULTIPLIERS = {
	경: 10_000_000_000_000_000n,
	조: 1_000_000_000_000n,
	억: 100_000_000n,
	만: 10_000n
} as const

type KoreanUnit = keyof typeof KOREAN_UNIT_MULTIPLIERS

const KOREAN_NUMBER_PATTERN = /(\d+(?:\.\d+)?)(경|조|억|만)?/g
/** 단위 숫자 전체 형식. 공백 유무 모두 허용. 예: `1경 200억`, `2023만4234` */
const KOREAN_UNIT_NUMBER_FULL_PATTERN = /^(?:\d+(?:\.\d+)?(?:경|조|억|만)?)(?:\s*\d+(?:\.\d+)?(?:경|조|억|만)?)*$/
const KOREAN_UNIT_CHAR_PATTERN = /[경조억만]/

function parsePlainNumber(value: string): bigint | null {
	if (!/^\d+(?:\.\d+)?$/.test(value)) {
		return null
	}

	return BigInt(Math.trunc(Number(value)))
}

/** 콤마 제거 후 공백을 한 칸으로 정규화 */
function normalizeKoreanNumberInput(input: string): string {
	return input.replace(/,/g, '').replace(/\s+/g, ' ').trim()
}

function hasKoreanNumberUnits(value: string): boolean {
	return KOREAN_UNIT_CHAR_PATTERN.test(value)
}

/**
 * 한국어 단위(경/조/억/만) 또는 일반 숫자 문자열을 bigint로 변환합니다.
 *
 * @example
 * parseKoreanNumber('1739조 115억') // 1739115000000000n
 * parseKoreanNumber('15,246,720')   // 15246720n
 */
function parseKoreanNumber(input: string | number): bigint {
	if (typeof input === 'number') {
		return BigInt(Math.trunc(input))
	}

	const normalized = input.replace(/,/g, '').replace(/\s+/g, '').trim()

	if (!normalized) {
		return 0n
	}

	const plainNumber = parsePlainNumber(normalized)

	if (plainNumber !== null) {
		return plainNumber
	}

	let total = 0n
	let matched = false

	for (const match of normalized.matchAll(KOREAN_NUMBER_PATTERN)) {
		const [, numberPart, unitPart] = match
		const numericValue = BigInt(Math.trunc(Number(numberPart)))

		if (unitPart) {
			total += numericValue * KOREAN_UNIT_MULTIPLIERS[unitPart as KoreanUnit]
		} else {
			total += numericValue
		}

		matched = true
	}

	if (!matched) {
		throw new Error(`한국어 숫자 형식을 해석할 수 없습니다: "${input}"`)
	}

	return total
}

/**
 * 전투력·점수 등 Sheet 저장용. 경/조/억/만 단위가 반드시 있어야 합니다.
 *
 * @example
 * normalizeKoreanUnitNumber('1경 200억') // '1경 200억'
 * normalizeKoreanUnitNumber('2023만 4234') // '2023만 4234'
 */
function normalizeKoreanUnitNumber(input: string): string {
	const normalized = normalizeKoreanNumberInput(input)

	if (!normalized) {
		throw new Error('값이 필요합니다.')
	}

	if (!hasKoreanNumberUnits(normalized)) {
		throw new Error('경/조/억/만 단위를 포함해 입력하세요. 예: 3021조 238억')
	}

	if (!KOREAN_UNIT_NUMBER_FULL_PATTERN.test(normalized)) {
		throw new Error('형식이 올바르지 않습니다. 예: 1경 200억, 2023만 4234')
	}

	const parsed = parseKoreanNumber(normalized)

	if (parsed <= 0n) {
		throw new Error('0보다 큰 값이어야 합니다.')
	}

	return normalized
}

/** 수련장 Sheet용: 1,000만 이상은 단위 문자열 */
function formatTrainingScoreForSheet(value: bigint): string {
	if (value < TRAINING_KOREAN_FORMAT_THRESHOLD) {
		return value.toString()
	}

	const unitOrder = [
		['경', KOREAN_UNIT_MULTIPLIERS.경],
		['조', KOREAN_UNIT_MULTIPLIERS.조],
		['억', KOREAN_UNIT_MULTIPLIERS.억],
		['만', KOREAN_UNIT_MULTIPLIERS.만]
	] as const

	const parts: string[] = []
	let remaining = value

	for (const [unitName, unitValue] of unitOrder) {
		if (remaining >= unitValue) {
			const count = remaining / unitValue
			remaining %= unitValue
			parts.push(`${count}${unitName}`)
		}
	}

	if (remaining > 0n) {
		parts.push(remaining.toString())
	}

	return parts.join(' ')
}

/**
 * 수련장 점수 Sheet 저장용.
 * 게임과 같이 1,000만 미만은 숫자, 이상은 단위 문자열로 저장합니다.
 *
 * @example
 * normalizeTrainingScoreNumber('9000000') // '9000000'
 * normalizeTrainingScoreNumber('1000만 101') // '1000만 101'
 * normalizeTrainingScoreNumber('10000101') // '1000만 101'
 */
function normalizeTrainingScoreNumber(input: string): string {
	const normalized = normalizeKoreanNumberInput(input)

	if (!normalized) {
		throw new Error('값이 필요합니다.')
	}

	const plainDigits = normalized.replace(/\s+/g, '')
	const hasUnits = hasKoreanNumberUnits(normalized)

	if (!hasUnits) {
		if (!/^\d+$/.test(plainDigits)) {
			throw new Error('형식이 올바르지 않습니다. 예: 9000000 또는 1000만 101')
		}

		const parsed = BigInt(plainDigits)

		if (parsed <= 0n) {
			throw new Error('0보다 큰 숫자여야 합니다.')
		}

		// 1,000만 이상 숫자는 게임 표기(단위)로 맞춰 저장
		return formatTrainingScoreForSheet(parsed)
	}

	if (!KOREAN_UNIT_NUMBER_FULL_PATTERN.test(normalized)) {
		throw new Error('형식이 올바르지 않습니다. 예: 9000000 또는 1000만 101')
	}

	const parsed = parseKoreanNumber(normalized)

	if (parsed <= 0n) {
		throw new Error('0보다 큰 값이어야 합니다.')
	}

	if (parsed < TRAINING_KOREAN_FORMAT_THRESHOLD) {
		throw new Error('1,000만 미만은 숫자만 입력하세요. 예: 9000000')
	}

	return formatTrainingScoreForSheet(parsed)
}

export {
	hasKoreanNumberUnits,
	normalizeKoreanUnitNumber,
	normalizeTrainingScoreNumber,
	parseKoreanNumber,
	TRAINING_KOREAN_FORMAT_THRESHOLD
}
