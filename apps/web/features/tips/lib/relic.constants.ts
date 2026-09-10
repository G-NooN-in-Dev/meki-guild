import {
	ITEM_GRADE_BADGE_CLASS,
	ITEM_GRADE_ORDER,
	ITEM_GRADE_TAB_CLASS
} from '@/features/tips/lib/item-grade.constants'
import { RELIC_CATALOG_SOURCE } from '@/features/tips/lib/relic-catalog.data'
import { RELIC_EFFECT_DEFINITION_BY_ID } from '@/features/tips/lib/relic-effects.data'
import {
	clampRelicAwakeningStage,
	formatRelicStatValue,
	roundRelicStatValue
} from '@/features/tips/lib/relic-stat.helpers'
import type {
	Relic,
	RelicGrade,
	RelicLoadout,
	RelicResolvedEffects,
	RelicSlotLoadout,
	RelicStatEffect,
	RelicStatUnit
} from '@/features/tips/types/relic.type'

/** UI·정렬용 등급 순서 — 공통 ITEM_GRADE_ORDER 재사용 */
export const RELIC_GRADE_ORDER = ITEM_GRADE_ORDER

/** 등급 표시 라벨 — MGF.GG 유물 페이지 표기(레전드리)를 따릅니다. */
export const RELIC_GRADE_META = {
	legendary: {
		label: '레전드리'
	},
	unique: {
		label: '유니크'
	},
	epic: {
		label: '에픽'
	}
} as const satisfies Record<RelicGrade, { label: string }>

/** 등급 Badge·탭 색상 — 공통 상수 재사용 */
export const RELIC_GRADE_BADGE_CLASS = ITEM_GRADE_BADGE_CLASS
export const RELIC_GRADE_TAB_CLASS = ITEM_GRADE_TAB_CLASS

/** 유물 슬롯은 총 4칸 */
export const RELIC_SETUP_SLOTS = [
	{ id: 'slot-1', label: '유물 슬롯 1' },
	{ id: 'slot-2', label: '유물 슬롯 2' },
	{ id: 'slot-3', label: '유물 슬롯 3' },
	{ id: 'slot-4', label: '유물 슬롯 4' }
] as const

/** 유물 각성은 0~5 단계 */
export const RELIC_MAX_AWAKENING_STAGE = 5

const EMPTY_SLOT_LOADOUT: RelicSlotLoadout = { relicId: null, stage: 0, potentialIds: [] }

/** 빈 세팅 보드 (슬롯별 null) */
function createEmptyRelicLoadout(): RelicLoadout {
	return Object.fromEntries(RELIC_SETUP_SLOTS.map((slot) => [slot.id, { ...EMPTY_SLOT_LOADOUT }]))
}

export const RELIC_ICON_KEY = Object.fromEntries(
	RELIC_CATALOG_SOURCE.map((relic) => [relic.name, relic.iconKey])
) as Record<(typeof RELIC_CATALOG_SOURCE)[number]['name'], (typeof RELIC_CATALOG_SOURCE)[number]['iconKey']>

/** iconKey → public 경로 */
function getRelicImageSrcByIconKey(iconKey: string) {
	return iconKey ? `/tips/relics/${iconKey}.png` : ''
}

/** 유물 표시명 → public 경로. 매핑이 없으면 빈 문자열. */
function getRelicImageSrc(name: string) {
	const iconKey = RELIC_ICON_KEY[name as keyof typeof RELIC_ICON_KEY]
	return iconKey ? getRelicImageSrcByIconKey(iconKey) : ''
}

function createRelic(entry: (typeof RELIC_CATALOG_SOURCE)[number]): Relic {
	return {
		id: `${entry.grade}-${entry.iconKey}`,
		name: entry.name,
		grade: entry.grade,
		iconKey: entry.iconKey,
		imageSrc: getRelicImageSrcByIconKey(entry.iconKey)
	}
}

/** 등급 높은 순 → 이름 가나다순으로 정렬된 전체 유물 카탈로그 */
export const RELICS: readonly Relic[] = [...RELIC_CATALOG_SOURCE].map(createRelic).sort((a, b) => {
	const gradeDiff = RELIC_GRADE_ORDER.indexOf(a.grade) - RELIC_GRADE_ORDER.indexOf(b.grade)
	if (gradeDiff !== 0) {
		return gradeDiff
	}

	return a.name.localeCompare(b.name, 'ko')
})

function getRelicById(id: string): Relic | undefined {
	return RELICS.find((relic) => relic.id === id)
}

function getRelicByName(name: string): Relic | undefined {
	return RELICS.find((relic) => relic.name === name)
}

function getRelicsByGrade(grade: RelicGrade): readonly Relic[] {
	return RELICS.filter((relic) => relic.grade === grade)
}

/** 합산 키: 같은 라벨·스코프·단위끼리만 더합니다. */
function relicStatAggregationKey({ label, scope, unit }: Pick<RelicStatEffect, 'label' | 'scope' | 'unit'>) {
	return `${label}::${scope ?? 'always'}::${unit}`
}

function getRelicActivationCondition(relicId: string): string | undefined {
	return RELIC_EFFECT_DEFINITION_BY_ID[relicId]?.activationCondition
}

function resolveRelicEffects(relicId: string, stage: number): RelicResolvedEffects | null {
	const relic = getRelicById(relicId)
	const definition = RELIC_EFFECT_DEFINITION_BY_ID[relicId]
	if (!relic || !definition) {
		return null
	}

	const safeStage = clampRelicAwakeningStage(stage)
	return {
		relicId: relic.id,
		relicName: relic.name,
		grade: relic.grade,
		stage: safeStage,
		lines: definition.resolveLines(safeStage),
		stats: definition.resolveStats(safeStage)
	}
}

/**
 * 장착된 유물 스탯을 라벨·스코프별로 합산합니다.
 * 조건부 효과(월드보스 등)는 scope가 달라서 상시 수치와 섞이지 않습니다.
 */
function aggregateRelicStats(stats: readonly RelicStatEffect[]): readonly RelicStatEffect[] {
	const totals = new Map<string, { label: string; value: number; unit: RelicStatUnit; scope?: string }>()

	for (const { label, value, unit, scope } of stats) {
		const key = relicStatAggregationKey({ label, scope, unit })
		const existing = totals.get(key)
		if (existing) {
			existing.value += value
			continue
		}

		totals.set(key, { label, value, unit, scope })
	}

	return [...totals.values()].map(({ label, value, unit, scope }) => {
		const rounded = roundRelicStatValue(value, unit)
		return {
			label,
			value: rounded,
			unit,
			scope,
			displayText: `${label} ${formatRelicStatValue(rounded, unit)}`
		} satisfies RelicStatEffect
	})
}

export {
	aggregateRelicStats,
	clampRelicAwakeningStage,
	createEmptyRelicLoadout,
	getRelicActivationCondition,
	getRelicById,
	getRelicByName,
	getRelicImageSrc,
	getRelicImageSrcByIconKey,
	getRelicsByGrade,
	resolveRelicEffects
}
