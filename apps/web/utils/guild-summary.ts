import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { sumExpeditionGradePoints } from '@/libs/expedition-guild-tier.constants'
import { formatKoreanDelta, formatTrainingDelta } from '@/utils/format-korean-number'

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
export function calculateTotalNumericChange(
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

/** 이번 주 기준 길드원 평균 레벨(이탈·미입력 멤버 제외) */
export function calculateAverageLevel(comparisons: GuildMemberComparison[]): string {
	const levels = comparisons
		.filter((comparison) => comparison.status !== 'left' && comparison.level.hasValue)
		.map((comparison) => comparison.level.current)

	if (levels.length === 0) {
		return '-'
	}

	const average = Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)

	return `${average}`
}

function formatPointsDelta(diff: number): string | null {
	if (diff === 0) {
		return null
	}

	const sign = diff > 0 ? '+' : '-'

	return `${sign}${Math.abs(diff).toLocaleString('ko-KR')}`
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
export function calculateExpeditionGradePointsTotal(comparisons: GuildMemberComparison[]): string {
	const grades = getCurrentExpeditionGrades(comparisons)

	if (grades.length === 0) {
		return '-'
	}

	return sumExpeditionGradePoints(grades).toLocaleString('ko-KR')
}

/** 길드원 개인 토벌전 등급 포인트 합계의 주간 변화량 */
export function calculateExpeditionGradePointsChange(comparisons: GuildMemberComparison[]): string | null {
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

export function calculateGuildSummaryMetrics(comparisons: GuildMemberComparison[]) {
	return {
		combatPowerChange: formatKoreanDelta(
			calculateTotalNumericChange(comparisons, (comparison) => comparison.combatPower)
		),
		averageLevel: calculateAverageLevel(comparisons),
		expeditionScoreChange: formatKoreanDelta(
			calculateTotalNumericChange(comparisons, (comparison) => comparison.expeditionScore)
		),
		expeditionGradePointsTotal: calculateExpeditionGradePointsTotal(comparisons),
		expeditionGradePointsChange: calculateExpeditionGradePointsChange(comparisons),
		rivalryChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, (comparison) => comparison.rivalry)),
		trainingChange: formatTrainingDelta(calculateTotalNumericChange(comparisons, (comparison) => comparison.training)),
		guildBossChange: formatKoreanDelta(
			calculateTotalNumericChange(comparisons, (comparison) => comparison.guildBoss, hasGuildBossContribution)
		)
	}
}
