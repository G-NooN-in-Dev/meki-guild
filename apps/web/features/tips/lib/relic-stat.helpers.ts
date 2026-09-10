import type { RelicAwakeningStage, RelicStatEffect, RelicStatUnit } from '@/features/tips/types/relic.type'

/** 유물 각성 상한 — constants의 RELIC_MAX_AWAKENING_STAGE와 동일 */
const RELIC_MAX_AWAKENING_STAGE = 5

function stageValue<T>(values: readonly T[], stage: RelicAwakeningStage): T {
	const value = values[stage]
	if (value === undefined) {
		throw new Error(`각성 단계 값이 없습니다: stage=${stage}`)
	}
	return value
}

function stagePercent(values: readonly number[], stage: RelicAwakeningStage): string {
	return `${stageValue(values, stage)}%`
}

function stageFlat(values: readonly number[], stage: RelicAwakeningStage): string {
	return `${stageValue(values, stage)}`
}

/** 입력 단계가 범위를 벗어나면 0~5로 보정 */
function clampRelicAwakeningStage(stage: number): RelicAwakeningStage {
	const clamped = Math.min(RELIC_MAX_AWAKENING_STAGE, Math.max(0, Math.floor(stage)))
	return clamped as RelicAwakeningStage
}

/** 게임 표시와 맞추기: %는 소수 1자리, 절대값은 정수 */
function roundRelicStatValue(value: number, unit: RelicStatUnit) {
	if (unit === 'percent') {
		return Math.round(value * 10) / 10
	}

	return Math.round(value)
}

function formatRelicStatValue(value: number, unit: RelicStatUnit) {
	const rounded = roundRelicStatValue(value, unit)
	return unit === 'percent' ? `+${rounded}%` : `+${rounded}`
}

/**
 * 합산용 스탯 한 줄을 만듭니다.
 * scope가 있으면 UI·합산에서 "최종 데미지 (월드보스)"처럼 구분해 표시합니다.
 */
function createRelicStat(
	label: string,
	values: readonly number[],
	stage: RelicAwakeningStage,
	unit: RelicStatUnit,
	scope?: string
): RelicStatEffect {
	const value = roundRelicStatValue(stageValue(values, stage), unit)
	return {
		label,
		value,
		unit,
		scope,
		displayText: `${label} ${formatRelicStatValue(value, unit)}`
	}
}

export {
	clampRelicAwakeningStage,
	createRelicStat,
	formatRelicStatValue,
	roundRelicStatValue,
	stageFlat,
	stagePercent,
	stageValue
}
