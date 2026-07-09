const KOREAN_UNIT_MULTIPLIERS = {
	경: 10_000_000_000_000_000n,
	조: 1_000_000_000_000n,
	억: 100_000_000n,
	만: 10_000n
} as const

type KoreanUnit = keyof typeof KOREAN_UNIT_MULTIPLIERS

const KOREAN_NUMBER_PATTERN = /(\d+(?:\.\d+)?)(경|조|억|만)?/g

function parsePlainNumber(value: string): bigint | null {
	if (!/^\d+(?:\.\d+)?$/.test(value)) {
		return null
	}

	return BigInt(Math.trunc(Number(value)))
}

/**
 * 한국어 단위(경/조/억/만) 또는 일반 숫자 문자열을 bigint로 변환합니다.
 *
 * @example
 * parseKoreanNumber('1739조 115억') // 1739115000000000n
 * parseKoreanNumber('15,246,720')   // 15246720n
 */
export function parseKoreanNumber(input: string | number): bigint {
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
