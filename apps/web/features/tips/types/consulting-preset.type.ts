/** 프리셋 스탯 단위. percent=% / flat=절대값(명중·회피) */
type ConsultingPresetStatUnit = 'percent' | 'flat'

/**
 * 현재 프리셋 기준 전투 수치 키.
 * UI·검증·저장 순서는 CONSULTING_PRESET_STAT_FIELDS를 따릅니다.
 */
type ConsultingPresetStatId =
	| 'critRate'
	| 'critDamage'
	| 'attackSpeed'
	| 'mainStatBonus'
	| 'minDamageMultiplier'
	| 'maxDamageMultiplier'
	| 'bossDamage'
	| 'normalDamage'
	| 'accuracy'
	| 'evasion'

/** 프리셋 스탯 수치 맵 */
type ConsultingPresetStats = Record<ConsultingPresetStatId, number>

export type { ConsultingPresetStatId, ConsultingPresetStats, ConsultingPresetStatUnit }
