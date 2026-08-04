import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { sumExpeditionGradePoints } from '@/libs/expedition-guild-tier.constants'
import {
	formatDeltaPercent,
	formatKoreanDelta,
	formatLocaleNumber,
	formatTrainingDelta
} from '@/utils/format-korean-number'

type NumericFieldSelector = (_comparison: GuildMemberComparison) => NumericDeltaLike

type NumericDeltaLike = {
	current: bigint
	previous: bigint | null
	diff: bigint | null
	hasValue: boolean
}

/**
 * 신규·이탈을 반영한 길드 전체 수치 변화를 합산합니다.
 * - active: diff (입력된 값만)
 * - new: current(전주 데이터 없음, 입력된 값만)
 * - left: diff(음수)
 */
function calculateTotalNumericChange(
	comparisons: GuildMemberComparison[],
	getField: NumericFieldSelector,
	shouldInclude?: (_comparison: GuildMemberComparison) => boolean
): bigint {
	return comparisons.reduce((sum, comparison) => {
		if (shouldInclude && !shouldInclude(comparison)) {
			return sum
		}

		const field = getField(comparison)

		if (comparison.status === 'new') {
			return field.hasValue ? sum + field.current : sum
		}

		if (!field.hasValue || field.diff === null) {
			return sum
		}

		return sum + field.diff
	}, 0n)
}

/**
 * 증감율 분모용 직전 주 합산값.
 * calculateTotalNumericChange와 같은 멤버 포함 규칙을 따릅니다(신규는 이전값 없음 → 제외).
 */
function calculateTotalPrevious(
	comparisons: GuildMemberComparison[],
	getField: NumericFieldSelector,
	shouldInclude?: (_comparison: GuildMemberComparison) => boolean
): bigint {
	return comparisons.reduce((sum, comparison) => {
		if (shouldInclude && !shouldInclude(comparison)) {
			return sum
		}

		const field = getField(comparison)

		if (comparison.status === 'new') {
			return sum
		}

		if (!field.hasValue || field.diff === null || field.previous === null) {
			return sum
		}

		return sum + field.previous
	}, 0n)
}

/** 길드 합산 변화량 ÷ 직전 합산 → 증감율 라벨 */
function calculateTotalChangePercent(
	comparisons: GuildMemberComparison[],
	getField: NumericFieldSelector,
	shouldInclude?: (_comparison: GuildMemberComparison) => boolean
): string | null {
	const diff = calculateTotalNumericChange(comparisons, getField, shouldInclude)
	const previous = calculateTotalPrevious(comparisons, getField, shouldInclude)

	return formatDeltaPercent(diff, previous)
}

/** 이번 주 기준 길드원 평균 레벨(이탈·미입력 멤버 제외) */
function calculateAverageLevel(comparisons: GuildMemberComparison[]): string {
	const levels = comparisons
		.filter((comparison) => comparison.status !== 'left' && comparison.level.hasValue)
		.map((comparison) => comparison.level.current)

	if (levels.length === 0) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	const average = Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)

	return `${average}`
}

function formatPointsDelta(diff: number): string | null {
	if (diff === 0) {
		return null
	}

	const sign = diff > 0 ? '+' : '-'

	return `${sign}${formatLocaleNumber(Math.abs(diff))}`
}

function getCurrentExpeditionGrades(comparisons: GuildMemberComparison[]): string[] {
	return comparisons
		.filter((comparison) => comparison.status !== 'left' && comparison.expeditionGrade.hasValue)
		.map((comparison) => comparison.expeditionGrade.current)
}

function getPreviousExpeditionGrades(comparisons: GuildMemberComparison[]): string[] {
	return comparisons
		.filter(
			(comparison) =>
				comparison.status !== 'new' &&
				comparison.expeditionGrade.hasValue &&
				comparison.expeditionGrade.previous !== null
		)
		.map((comparison) => comparison.expeditionGrade.previous as string)
}

/** 이번 주 길드원 개인 토벌전 등급 포인트 합계 */
function calculateExpeditionGradePointsTotal(comparisons: GuildMemberComparison[]): string {
	const grades = getCurrentExpeditionGrades(comparisons)

	if (grades.length === 0) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	return formatLocaleNumber(sumExpeditionGradePoints(grades))
}

/** 길드원 개인 토벌전 등급 포인트 합계의 주간 변화량 */
function calculateExpeditionGradePointsChange(comparisons: GuildMemberComparison[]): string | null {
	const currentGrades = getCurrentExpeditionGrades(comparisons)
	const previousGrades = getPreviousExpeditionGrades(comparisons)

	if (currentGrades.length === 0 || previousGrades.length === 0) {
		return null
	}

	const currentPoints = sumExpeditionGradePoints(currentGrades)
	const previousPoints = sumExpeditionGradePoints(previousGrades)

	return formatPointsDelta(currentPoints - previousPoints)
}

/** 길드보스 데이터가 있는 멤버만 합산 대상에 포함 */
function hasGuildBossContribution(comparison: GuildMemberComparison): boolean {
	if (comparison.status === 'new' || comparison.status === 'active') {
		return comparison.guildBoss.hasValue
	}

	return comparison.guildBoss.previous !== null
}

function calculateGuildSummaryMetrics(comparisons: GuildMemberComparison[]) {
	const combatPowerField = (comparison: GuildMemberComparison) => comparison.combatPower
	const expeditionScoreField = (comparison: GuildMemberComparison) => comparison.expeditionScore
	const rivalryField = (comparison: GuildMemberComparison) => comparison.rivalry
	const trainingField = (comparison: GuildMemberComparison) => comparison.training
	const guildBossField = (comparison: GuildMemberComparison) => comparison.guildBoss

	return {
		combatPowerChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, combatPowerField)),
		combatPowerChangePercent: calculateTotalChangePercent(comparisons, combatPowerField),
		averageLevel: calculateAverageLevel(comparisons),
		expeditionScoreChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, expeditionScoreField)),
		expeditionScoreChangePercent: calculateTotalChangePercent(comparisons, expeditionScoreField),
		expeditionGradePointsTotal: calculateExpeditionGradePointsTotal(comparisons),
		expeditionGradePointsChange: calculateExpeditionGradePointsChange(comparisons),
		rivalryChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, rivalryField)),
		rivalryChangePercent: calculateTotalChangePercent(comparisons, rivalryField),
		trainingChange: formatTrainingDelta(calculateTotalNumericChange(comparisons, trainingField)),
		trainingChangePercent: calculateTotalChangePercent(comparisons, trainingField),
		guildBossChange: formatKoreanDelta(
			calculateTotalNumericChange(comparisons, guildBossField, hasGuildBossContribution)
		),
		guildBossChangePercent: calculateTotalChangePercent(comparisons, guildBossField, hasGuildBossContribution)
	}
}

export {
	calculateAverageLevel,
	calculateExpeditionGradePointsChange,
	calculateExpeditionGradePointsTotal,
	calculateGuildSummaryMetrics,
	calculateTotalNumericChange,
	calculateTotalPrevious
}
