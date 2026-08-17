import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { sumExpeditionGradePoints } from '@/libs/expedition-guild-tier.constants'
import { formatArrowDelta, formatRankArrowDelta } from '@/utils/format-delta-label'
import {
	formatDeltaPercent,
	formatKoreanDelta,
	formatKoreanNumber,
	formatLocaleNumber,
	formatPlacementRank,
	formatTrainingDelta
} from '@/utils/format-korean-number'
import { parseKoreanNumber } from '@/utils/parse-korean-number'

type GuildPlacementRankInput = {
	current: number | null | undefined
	previous: number | null | undefined
}

type GuildMetaPointsInput = {
	current: number | string | null | undefined
	previous: number | string | null | undefined
}

type GuildSummaryMetaInput = {
	expeditionRank?: GuildPlacementRankInput
	rivalryRank?: GuildPlacementRankInput
	rivalryPoints?: GuildMetaPointsInput
}

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

/** 이번 주 기준 길드 총 전투력(이탈·미입력 멤버 제외) */
function calculateCombatPowerTotal(comparisons: GuildMemberComparison[]): string {
	const totals = comparisons.filter((comparison) => comparison.status !== 'left' && comparison.combatPower.hasValue)

	if (totals.length === 0) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	const sum = totals.reduce((acc, comparison) => acc + comparison.combatPower.current, 0n)

	return formatKoreanNumber(sum)
}

function averageRounded(levels: number[]): number | null {
	if (levels.length === 0) {
		return null
	}

	return Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)
}

/** 이번 주 기준 길드원 평균 레벨(이탈·미입력 멤버 제외) */
function calculateAverageLevel(comparisons: GuildMemberComparison[]): string {
	const average = averageRounded(
		comparisons
			.filter((comparison) => comparison.status !== 'left' && comparison.level.hasValue)
			.map((comparison) => comparison.level.current)
	)

	return average === null ? GUILD_EMPTY_VALUE_LABEL : `${average}`
}

/**
 * 직전 주 대비 평균 레벨 증감.
 * 이번 주: 잔류·신규(입력분), 직전 주: 잔류·이탈(이전 값 있는 분).
 */
function calculateAverageLevelChange(comparisons: GuildMemberComparison[]): string | null {
	const currentAverage = averageRounded(
		comparisons
			.filter((comparison) => comparison.status !== 'left' && comparison.level.hasValue)
			.map((comparison) => comparison.level.current)
	)
	const previousAverage = averageRounded(
		comparisons
			.filter((comparison) => comparison.status !== 'new' && comparison.level.previous !== null)
			.map((comparison) => comparison.level.previous as number)
	)

	if (currentAverage === null || previousAverage === null) {
		return null
	}

	return formatArrowDelta(currentAverage - previousAverage)
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

function parseGuildPlacementRank(value: number | null | undefined): number | null {
	if (value === null || value === undefined) {
		return null
	}

	if (!Number.isFinite(value) || value <= 0) {
		return null
	}

	return Math.floor(value)
}

/** 길드 순위 표시·증감(등수라 숫자가 작을수록 상위). 토벌전·대항전 공통 */
function calculateGuildPlacementRank(rank: GuildPlacementRankInput): {
	label: string
	changeLabel: string | null
} {
	const current = parseGuildPlacementRank(rank.current)
	const previous = parseGuildPlacementRank(rank.previous)

	if (current === null) {
		return { label: GUILD_EMPTY_VALUE_LABEL, changeLabel: null }
	}

	return {
		label: formatPlacementRank(current),
		changeLabel: previous === null ? null : formatRankArrowDelta(current - previous)
	}
}

const calculateGuildExpeditionRank = calculateGuildPlacementRank

function hasKoreanUnits(value: number | string | null | undefined): boolean {
	return typeof value === 'string' && /[경조억만]/.test(value)
}

function parseGuildMetaPoints(value: number | string | null | undefined): bigint | null {
	if (value === null || value === undefined) {
		return null
	}

	if (typeof value === 'string' && value.trim() === '') {
		return null
	}

	if (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) {
		return null
	}

	try {
		return parseKoreanNumber(value)
	} catch {
		return null
	}
}

function formatGuildMetaPointsLabel(original: number | string): string {
	if (typeof original === 'number') {
		return formatLocaleNumber(original)
	}

	if (hasKoreanUnits(original)) {
		return original.trim()
	}

	const parsed = parseGuildMetaPoints(original)

	return parsed === null ? GUILD_EMPTY_VALUE_LABEL : formatLocaleNumber(parsed)
}

function formatGuildMetaPointsDelta(
	diff: bigint,
	currentOriginal: number | string | null | undefined,
	previousOriginal: number | string | null | undefined
): string | null {
	if (diff === 0n) {
		return null
	}

	if (hasKoreanUnits(currentOriginal) || hasKoreanUnits(previousOriginal)) {
		return formatKoreanDelta(diff)
	}

	if (diff <= BigInt(Number.MAX_SAFE_INTEGER) && diff >= BigInt(Number.MIN_SAFE_INTEGER)) {
		return formatPointsDelta(Number(diff))
	}

	return formatKoreanDelta(diff)
}

/** 길드 대항전 포인트 총합 표시·증감. 직전 값이 없으면 증감은 숨깁니다. */
function calculateGuildRivalryPoints(points: GuildMetaPointsInput): {
	label: string
	changeLabel: string | null
} {
	const currentOriginal = points.current
	const current = parseGuildMetaPoints(currentOriginal)
	const previous = parseGuildMetaPoints(points.previous)

	if (current === null || currentOriginal === null || currentOriginal === undefined) {
		return { label: GUILD_EMPTY_VALUE_LABEL, changeLabel: null }
	}

	return {
		label: formatGuildMetaPointsLabel(currentOriginal),
		changeLabel:
			previous === null ? null : formatGuildMetaPointsDelta(current - previous, currentOriginal, points.previous)
	}
}

/** 길드보스 데이터가 있는 멤버만 합산 대상에 포함 */
function hasGuildBossContribution(comparison: GuildMemberComparison): boolean {
	if (comparison.status === 'new' || comparison.status === 'active') {
		return comparison.guildBoss.hasValue
	}

	return comparison.guildBoss.previous !== null
}

function calculateGuildSummaryMetrics(comparisons: GuildMemberComparison[], guildMeta?: GuildSummaryMetaInput) {
	const combatPowerField = (comparison: GuildMemberComparison) => comparison.combatPower
	const expeditionScoreField = (comparison: GuildMemberComparison) => comparison.expeditionScore
	const rivalryField = (comparison: GuildMemberComparison) => comparison.rivalry
	const trainingField = (comparison: GuildMemberComparison) => comparison.training
	const guildBossField = (comparison: GuildMemberComparison) => comparison.guildBoss
	const emptyRank = { current: null, previous: null }
	const emptyPoints = { current: null, previous: null }
	const expeditionRank = calculateGuildPlacementRank(guildMeta?.expeditionRank ?? emptyRank)
	const rivalryRank = calculateGuildPlacementRank(guildMeta?.rivalryRank ?? emptyRank)
	const rivalryPoints = calculateGuildRivalryPoints(guildMeta?.rivalryPoints ?? emptyPoints)

	return {
		combatPowerTotal: calculateCombatPowerTotal(comparisons),
		combatPowerChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, combatPowerField)),
		combatPowerChangePercent: calculateTotalChangePercent(comparisons, combatPowerField),
		averageLevel: calculateAverageLevel(comparisons),
		averageLevelChange: calculateAverageLevelChange(comparisons),
		expeditionScoreChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, expeditionScoreField)),
		expeditionScoreChangePercent: calculateTotalChangePercent(comparisons, expeditionScoreField),
		expeditionGradePointsTotal: calculateExpeditionGradePointsTotal(comparisons),
		expeditionGradePointsChange: calculateExpeditionGradePointsChange(comparisons),
		guildExpeditionRankLabel: expeditionRank.label,
		guildExpeditionRankChange: expeditionRank.changeLabel,
		rivalryChange: formatKoreanDelta(calculateTotalNumericChange(comparisons, rivalryField)),
		rivalryChangePercent: calculateTotalChangePercent(comparisons, rivalryField),
		rivalryPointsTotal: rivalryPoints.label,
		rivalryPointsChange: rivalryPoints.changeLabel,
		guildRivalryRankLabel: rivalryRank.label,
		guildRivalryRankChange: rivalryRank.changeLabel,
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
	calculateAverageLevelChange,
	calculateCombatPowerTotal,
	calculateExpeditionGradePointsChange,
	calculateExpeditionGradePointsTotal,
	calculateGuildExpeditionRank,
	calculateGuildPlacementRank,
	calculateGuildRivalryPoints,
	calculateGuildSummaryMetrics,
	calculateTotalNumericChange,
	calculateTotalPrevious
}
