/** 성장 던전 단계별 필요 명중 한 줄 */
type GrowthDungeonHitCutEntry = {
	/** 던전 단계 (1부터) */
	stage: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
	/** 10·20·30… 어려운 단계 여부 */
	isHardStage: boolean
}

/** 경험치 던전 단계별 표 한 줄 */
type ExperienceDungeonHitCutEntry = GrowthDungeonHitCutEntry & {
	/** 해당 단계 처치해야 하는 몬스터 수 */
	requiredKillCount: number
}

/** 장비 던전 단계별 표 한 줄 */
type EquipmentDungeonHitCutEntry = GrowthDungeonHitCutEntry & {
	/** 해당 단계 제한시간(초) */
	timeLimitSec: number
	/** 해당 단계 처치해야 하는 몬스터 수 */
	requiredKillCount: number
}

/** 용사의 수련장 단계별 표 한 줄 */
type AbilityDungeonHitCutEntry = GrowthDungeonHitCutEntry & {}

/** 강화 던전 단계별 표 한 줄 */
type EnhanceDungeonHitCutEntry = GrowthDungeonHitCutEntry & {
	/** 해당 단계 주문의 흔적 획득 개수 */
	spellTraceCount: number
}

/** 의문의 주문서 — 게임 표기 티어(노말/레어/에픽) 비율(%) */
type EnhanceDungeonMysteriousScrollTier = {
	normal: number
	rare: number
	epic: number
}

/**
 * 의문의 주문서 — 세부 종류 **실제 획득** 확률(%).
 * 의문의 주문서 드롭률 × 티어 비율 × (레어 2종 ½ / 에픽 3종 ⅓).
 */
type EnhanceDungeonMysteriousScrollDetailRates = {
	/** 노말 40% 주문서 */
	normal40: number
	/** 레어 40% 주문서 */
	rare40: number
	/** 레어 25% 주문서 */
	rare25: number
	/** 에픽 70% 주문서 */
	epic70: number
	/** 에픽 30% 주문서 */
	epic30: number
	/** 에픽 15% 주문서 */
	epic15: number
}

/** 강화 던전 단계 구간별 의문의 주문서 확률 한 줄 */
type EnhanceDungeonMysteriousScrollBandEntry = {
	/** 구간 시작 단계 (포함) */
	stageFrom: number
	/** 구간 끝 단계 (포함) */
	stageTo: number
	/** 티어 비율 (합 100, 주문서 획득 시 조건부) */
	tiers: EnhanceDungeonMysteriousScrollTier
	/** 세부 6종 실제 획득 확률 (합 = 의문의 주문서 드롭률) */
	details: EnhanceDungeonMysteriousScrollDetailRates
}

export type {
	AbilityDungeonHitCutEntry,
	EnhanceDungeonHitCutEntry,
	EnhanceDungeonMysteriousScrollBandEntry,
	EnhanceDungeonMysteriousScrollDetailRates,
	EnhanceDungeonMysteriousScrollTier,
	EquipmentDungeonHitCutEntry,
	ExperienceDungeonHitCutEntry,
	GrowthDungeonHitCutEntry
}
