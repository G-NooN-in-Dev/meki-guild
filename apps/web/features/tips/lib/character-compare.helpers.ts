import type {
	CharacterCompareGradeField,
	CharacterCompareLevelField,
	CharacterCompareNullableNumberField,
	CharacterCompareNumericField,
	CharacterCompareRankField,
	CharacterCompareResult,
	CharacterCompareTextField,
	CharacterCompareWinner,
	MgfCharacterDto
} from '@/features/tips/types/character-compare.type'
import { getExpeditionGradeDiff, getExpeditionGradeFromStats } from '@/libs/expedition-guild-tier.constants'
import { getWeaponGradeDiff, parseWeaponGrade } from '@/libs/weapon-grade.constants'
import { getWorldBossGradeDiff, getWorldBossGradeFromStats } from '@/libs/world-boss-tier.constants'
import { formatArrowDelta, formatRankArrowDelta } from '@/utils/format-delta-label'
import { formatKoreanDelta, formatKoreanNumber, formatLocaleNumber } from '@/utils/format-korean-number'

const EMPTY_LABEL = '-'

/** mgf 점수 문자열 → bigint. 없거나 0이면 0n */
function parseScore(raw: string | null | undefined): bigint {
	if (!raw || raw === '0') {
		return 0n
	}

	try {
		return BigInt(raw)
	} catch {
		return 0n
	}
}

/** UI 단계 전환용 짧은 지연 */
function wait(ms: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})
}

async function fetchCharacterInfo(nickname: string): Promise<MgfCharacterDto> {
	const response = await fetch(`/api/tips/character-info?n=${encodeURIComponent(nickname)}`)
	const body = (await response.json()) as MgfCharacterDto & { message?: string }

	if (!response.ok) {
		throw new Error(body.message ?? `「${nickname}」 캐릭터 정보를 조회하지 못했습니다.`)
	}

	return body
}

function getHigherWinner(left: bigint, right: bigint): CharacterCompareWinner {
	if (left === right) return 'tie'
	return left > right ? 'left' : 'right'
}

function getLowerWinner(left: number, right: number): CharacterCompareWinner {
	if (left === right) return 'tie'
	return left < right ? 'left' : 'right'
}

function createNumericField(
	leftRaw: string | null | undefined,
	rightRaw: string | null | undefined,
	leftLabelFallback: string | null | undefined,
	rightLabelFallback: string | null | undefined
): CharacterCompareNumericField {
	const leftHasValue = Boolean(leftRaw && leftRaw !== '0')
	const rightHasValue = Boolean(rightRaw && rightRaw !== '0')

	const left = leftHasValue ? BigInt(leftRaw!) : 0n
	const right = rightHasValue ? BigInt(rightRaw!) : 0n
	const leftLabel = leftLabelFallback || (leftHasValue ? formatKoreanNumber(left) : EMPTY_LABEL)
	const rightLabel = rightLabelFallback || (rightHasValue ? formatKoreanNumber(right) : EMPTY_LABEL)

	if (!leftHasValue && !rightHasValue) {
		return {
			left,
			right,
			leftLabel: EMPTY_LABEL,
			rightLabel: EMPTY_LABEL,
			diff: 0n,
			diffLabel: null,
			winner: 'tie',
			leftHasValue,
			rightHasValue
		}
	}

	if (!leftHasValue || !rightHasValue) {
		return {
			left,
			right,
			leftLabel: leftHasValue ? leftLabel : EMPTY_LABEL,
			rightLabel: rightHasValue ? rightLabel : EMPTY_LABEL,
			diff: 0n,
			diffLabel: null,
			winner: leftHasValue ? 'left' : 'right',
			leftHasValue,
			rightHasValue
		}
	}

	const diff = left - right

	return {
		left,
		right,
		leftLabel,
		rightLabel,
		diff,
		diffLabel: diff === 0n ? null : formatKoreanDelta(diff),
		winner: getHigherWinner(left, right),
		leftHasValue,
		rightHasValue
	}
}

function createLevelField(left: number, right: number): CharacterCompareLevelField {
	const diff = left - right

	return {
		left,
		right,
		leftLabel: `Lv. ${formatLocaleNumber(left)}`,
		rightLabel: `Lv. ${formatLocaleNumber(right)}`,
		diff,
		diffLabel: formatArrowDelta(diff),
		winner: left === right ? 'tie' : left > right ? 'left' : 'right'
	}
}

/** 인기도 — 높을수록 우세. 없으면 muted */
function createPopularityField(left: number | null, right: number | null): CharacterCompareNullableNumberField {
	const leftHasValue = left !== null
	const rightHasValue = right !== null
	const leftLabel = leftHasValue ? formatLocaleNumber(left!) : EMPTY_LABEL
	const rightLabel = rightHasValue ? formatLocaleNumber(right!) : EMPTY_LABEL

	if (!leftHasValue && !rightHasValue) {
		return {
			left,
			right,
			leftLabel: EMPTY_LABEL,
			rightLabel: EMPTY_LABEL,
			diff: null,
			diffLabel: null,
			winner: 'tie',
			leftHasValue,
			rightHasValue
		}
	}

	if (!leftHasValue || !rightHasValue) {
		return {
			left,
			right,
			leftLabel,
			rightLabel,
			diff: null,
			diffLabel: null,
			winner: leftHasValue ? 'left' : 'right',
			leftHasValue,
			rightHasValue
		}
	}

	const diff = left! - right!

	return {
		left,
		right,
		leftLabel,
		rightLabel,
		diff,
		diffLabel: formatArrowDelta(diff),
		winner: left === right ? 'tie' : left! > right! ? 'left' : 'right',
		leftHasValue,
		rightHasValue
	}
}

function createRankField(left: number | null, right: number | null): CharacterCompareRankField {
	const leftHasValue = left !== null && left > 0
	const rightHasValue = right !== null && right > 0
	const leftLabel = leftHasValue ? `${formatLocaleNumber(left!)}위` : EMPTY_LABEL
	const rightLabel = rightHasValue ? `${formatLocaleNumber(right!)}위` : EMPTY_LABEL

	if (!leftHasValue && !rightHasValue) {
		return {
			left,
			right,
			leftLabel: EMPTY_LABEL,
			rightLabel: EMPTY_LABEL,
			diff: null,
			diffLabel: null,
			winner: 'tie',
			leftHasValue,
			rightHasValue
		}
	}

	if (!leftHasValue || !rightHasValue) {
		return {
			left,
			right,
			leftLabel,
			rightLabel,
			diff: null,
			diffLabel: null,
			winner: leftHasValue ? 'left' : 'right',
			leftHasValue,
			rightHasValue
		}
	}

	const diff = left! - right!

	return {
		left,
		right,
		leftLabel,
		rightLabel,
		diff,
		diffLabel: formatRankArrowDelta(diff),
		winner: getLowerWinner(left!, right!),
		leftHasValue,
		rightHasValue
	}
}

function createTextField(left: string | null | undefined, right: string | null | undefined): CharacterCompareTextField {
	return {
		leftLabel: left?.trim() || EMPTY_LABEL,
		rightLabel: right?.trim() || EMPTY_LABEL,
		winner: 'tie'
	}
}

/**
 * mgf 무기 라벨 비교.
 * 파싱되면 정규 등급명으로 승패·diff, 파싱 실패 시 원문만 표시(승패 없음).
 */
function createWeaponGradeField(
	leftRaw: string | null | undefined,
	rightRaw: string | null | undefined
): CharacterCompareGradeField {
	const leftCanonical = parseWeaponGrade(leftRaw)
	const rightCanonical = parseWeaponGrade(rightRaw)
	const leftTrimmed = leftRaw?.replace(/\s+/g, ' ').trim() || ''
	const rightTrimmed = rightRaw?.replace(/\s+/g, ' ').trim() || ''

	const leftHasValue = Boolean(leftTrimmed)
	const rightHasValue = Boolean(rightTrimmed)
	const leftLabel = leftCanonical ?? (leftTrimmed || EMPTY_LABEL)
	const rightLabel = rightCanonical ?? (rightTrimmed || EMPTY_LABEL)

	if (!leftCanonical || !rightCanonical) {
		return createUnresolvedGradeField({
			left: leftLabel,
			right: rightLabel,
			leftLabel,
			rightLabel,
			leftHasValue,
			rightHasValue
		})
	}

	return createGradeField(leftCanonical, rightCanonical, getWeaponGradeDiff)
}

/** 값 유무만 반영하고 등급 단계는 비웁니다. (파싱 실패·한쪽만 있는 경우) */
function createUnresolvedGradeField(input: {
	left: string
	right: string
	leftLabel: string
	rightLabel: string
	leftHasValue: boolean
	rightHasValue: boolean
}): CharacterCompareGradeField {
	const { left, right, leftLabel, rightLabel, leftHasValue, rightHasValue } = input

	if (!leftHasValue && !rightHasValue) {
		return {
			left: EMPTY_LABEL,
			right: EMPTY_LABEL,
			leftLabel: EMPTY_LABEL,
			rightLabel: EMPTY_LABEL,
			diff: null,
			diffLabel: null,
			winner: 'tie',
			leftHasValue,
			rightHasValue
		}
	}

	if (!leftHasValue || !rightHasValue) {
		return {
			left,
			right,
			leftLabel,
			rightLabel,
			diff: null,
			diffLabel: null,
			winner: leftHasValue ? 'left' : 'right',
			leftHasValue,
			rightHasValue
		}
	}

	return {
		left,
		right,
		leftLabel,
		rightLabel,
		diff: null,
		diffLabel: null,
		winner: 'tie',
		leftHasValue,
		rightHasValue
	}
}

/**
 * 등수·점수 → 등급 비교.
 * `getDiff(previous, current)`는 양수면 current가 더 높은 등급입니다.
 */
function createGradeField(
	leftGrade: string | null,
	rightGrade: string | null,
	getDiff: (previous: string, current: string) => number | null
): CharacterCompareGradeField {
	const leftHasValue = Boolean(leftGrade)
	const rightHasValue = Boolean(rightGrade)
	const leftLabel = leftGrade ?? EMPTY_LABEL
	const rightLabel = rightGrade ?? EMPTY_LABEL

	if (!leftHasValue || !rightHasValue) {
		return createUnresolvedGradeField({
			left: leftLabel,
			right: rightLabel,
			leftLabel,
			rightLabel,
			leftHasValue,
			rightHasValue
		})
	}

	// getDiff(previous, current): (right, left) → left가 높으면 양수
	const diff = getDiff(rightGrade!, leftGrade!)
	let winner: CharacterCompareWinner = 'tie'

	if (diff !== null && diff !== 0) {
		winner = diff > 0 ? 'left' : 'right'
	}

	return {
		left: leftGrade!,
		right: rightGrade!,
		leftLabel,
		rightLabel,
		diff,
		diffLabel: formatArrowDelta(diff),
		winner,
		leftHasValue,
		rightHasValue
	}
}

/** 두 캐릭터 DTO를 비교 결과로 변환합니다. */
function compareCharacters(left: MgfCharacterDto, right: MgfCharacterDto): CharacterCompareResult {
	return {
		left,
		right,
		globalRank: createRankField(left.globalRank, right.globalRank),
		serverLabel: createTextField(left.serverLabel, right.serverLabel),
		serverRank: createRankField(left.serverRank, right.serverRank),
		popularity: createPopularityField(left.popularity, right.popularity),
		level: createLevelField(left.level, right.level),
		combatPower: createNumericField(left.combatPower, right.combatPower, left.combatPowerLabel, right.combatPowerLabel),
		weapon: createWeaponGradeField(left.weapon, right.weapon),
		expeditionGrade: createGradeField(
			getExpeditionGradeFromStats(left.expedition?.rank ?? null, parseScore(left.expedition?.score)),
			getExpeditionGradeFromStats(right.expedition?.rank ?? null, parseScore(right.expedition?.score)),
			getExpeditionGradeDiff
		),
		expeditionRank: createRankField(left.expedition?.rank ?? null, right.expedition?.rank ?? null),
		expeditionScore: createNumericField(
			left.expedition?.score,
			right.expedition?.score,
			left.expedition?.scoreLabel,
			right.expedition?.scoreLabel
		),
		worldBossGrade: createGradeField(
			getWorldBossGradeFromStats(left.worldBoss?.rank ?? null, parseScore(left.worldBoss?.score)),
			getWorldBossGradeFromStats(right.worldBoss?.rank ?? null, parseScore(right.worldBoss?.score)),
			getWorldBossGradeDiff
		),
		worldBossRank: createRankField(left.worldBoss?.rank ?? null, right.worldBoss?.rank ?? null),
		worldBossScore: createNumericField(
			left.worldBoss?.score,
			right.worldBoss?.score,
			left.worldBoss?.scoreLabel,
			right.worldBoss?.scoreLabel
		)
	}
}

export { compareCharacters, fetchCharacterInfo, wait }
