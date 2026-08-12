import type { ItemGrade } from '@/features/tips/types/item-grade.type'

/** 유물 등급. MGF.GG 유물 시뮬레이터 기준 3단계입니다. */
type RelicGrade = ItemGrade

/** 유물 각성 단계. 0~5 단계(총 6단계) */
type RelicAwakeningStage = 0 | 1 | 2 | 3 | 4 | 5

/** 유물 스탯 수치 단위. percent=% / flat=절대값(명중 등) */
type RelicStatUnit = 'percent' | 'flat'

/**
 * 잠재옵션 등급.
 * 미스틱(빨강) > 레전드리 > 유니크 > 에픽 > 레어(파랑)
 */
type RelicPotentialGrade = 'mystic' | 'legendary' | 'unique' | 'epic' | 'rare'

/** 잠재옵션 카탈로그 한 줄 */
type RelicPotentialOption = {
	/** 고유 키 (예: mystic-main-stat-10) */
	id: string
	grade: RelicPotentialGrade
	label: string
	value: number
	unit: RelicStatUnit
	/** UI 표시용 (예: 주 스탯 +10%) */
	displayText: string
}

/** 슬롯에 장착된 유물 + 각성 + 잠재옵션 */
type RelicSlotLoadout = {
	relicId: string | null
	stage: number
	/** 선택한 잠재옵션 id 목록 (유물 등급별 최대 칸 수) */
	potentialIds: readonly string[]
}

/** 세팅 보드 전체 슬롯 상태 (slot id → loadout) */
type RelicLoadout = Record<string, RelicSlotLoadout>

/**
 * 유물 카탈로그 항목.
 * 효과·세팅 규칙은 기획 확정 후 이 타입을 확장합니다.
 */
type Relic = {
	/** 고유 키 (예: legendary-holy-grail) */
	id: string
	/** 게임/MGF 표시명 */
	name: string
	grade: RelicGrade
	/** public/tips/relics 파일명 키 (확장자 제외) */
	iconKey: string
	/** public 기준 아이콘 경로 (예: /tips/relics/holy-grail.png) */
	imageSrc: string
	/** 특정 콘텐츠에서만 발동하는 유물 조건 (없으면 항상 발동) */
	activationCondition?: string
}

/**
 * 합산용 구조화 스탯.
 * 같은 label + scope + unit끼리 더합니다.
 * 조건부·확률 효과는 scope로 구분해, 상시 수치와 섞이지 않게 합니다.
 */
type RelicStatEffect = {
	label: string
	value: number
	unit: RelicStatUnit
	/** 발동 범위 (예: 월드보스, 전투 시작 15초). 없으면 상시 */
	scope?: string
	/** UI에 바로 쓰는 문구 (예: 최종 데미지 +20%) */
	displayText: string
}

/** 선택된 각성 단계가 반영된 유물 효과 묶음 */
type RelicResolvedEffects = {
	relicId: string
	relicName: string
	grade: RelicGrade
	stage: RelicAwakeningStage
	/** 슬롯·편집기용 자연어 효과 문장 */
	lines: readonly string[]
	/** 사이드바 합산용 구조화 스탯 */
	stats: readonly RelicStatEffect[]
}

export type {
	Relic,
	RelicAwakeningStage,
	RelicGrade,
	RelicLoadout,
	RelicPotentialGrade,
	RelicPotentialOption,
	RelicResolvedEffects,
	RelicSlotLoadout,
	RelicStatEffect,
	RelicStatUnit
}
