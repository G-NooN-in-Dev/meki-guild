import {
	CONSULTING_PRESET_STAT_FIELDS,
	createEmptyPresetStats
} from '@/features/tips/lib/companion-consulting.constants'
import {
	aggregateEquipEffects,
	getCompanionById,
	resolveEquipEffects
} from '@/features/tips/lib/companion-setup.constants'
import { aggregateRelicStats, resolveRelicEffects } from '@/features/tips/lib/relic.constants'
import { resolvePotentialStats } from '@/features/tips/lib/relic-potential.constants'
import type {
	CompanionConsultingLoadout,
	ConsultingPresetStatId,
	ConsultingPresetStats
} from '@/features/tips/types/companion-consulting.type'
import type { RelicStatEffect } from '@/features/tips/types/relic.type'
import type { RelicConsultingLoadout } from '@/features/tips/types/relic-consulting.type'

/**
 * 장착 효과 라벨 → 프리셋 필드.
 * 기본 공격/최종 데미지·스킬 데미지 등은 프리셋에 의도적으로 없어서 매핑하지 않습니다.
 * `주 스탯`은 UI 라벨 `주스탯 추가 퍼센트`와 alias입니다.
 */
const EQUIP_LABEL_TO_PRESET_STAT_ID = {
	'크리티컬 확률': 'critRate',
	'크리티컬 데미지': 'critDamage',
	'공격 속도': 'attackSpeed',
	'주 스탯': 'mainStatBonus',
	'최소 데미지 배율': 'minDamageMultiplier',
	'최대 데미지 배율': 'maxDamageMultiplier',
	'보스 몬스터 데미지': 'bossDamage',
	'일반 몬스터 데미지': 'normalDamage',
	명중: 'accuracy',
	회피: 'evasion'
} as const satisfies Record<string, ConsultingPresetStatId>

function roundPresetStatValue(value: number) {
	return Math.round(value * 10) / 10
}

/** 라벨·수치 목록을 프리셋 기여분으로 바꿉니다. 매핑 없는 라벨은 무시합니다. */
function mapLabeledEffectsToPresetStats(effects: readonly { label: string; value: number }[]): ConsultingPresetStats {
	const contribution = createEmptyPresetStats()

	for (const effect of effects) {
		const fieldId =
			effect.label in EQUIP_LABEL_TO_PRESET_STAT_ID
				? EQUIP_LABEL_TO_PRESET_STAT_ID[effect.label as keyof typeof EQUIP_LABEL_TO_PRESET_STAT_ID]
				: undefined
		if (!fieldId) {
			continue
		}

		contribution[fieldId] += effect.value
	}

	return contribution
}

/**
 * 현재 프리셋에서 장착 A 기여를 빼고 B를 더합니다.
 * 작성 프리셋이 이미 현재 장착을 포함한 게임 수치라는 전제입니다.
 */
export function projectPresetStatsAfterLoadoutSwap(
	basePresetStats: ConsultingPresetStats,
	fromContribution: ConsultingPresetStats,
	toContribution: ConsultingPresetStats
): ConsultingPresetStats {
	const projected = createEmptyPresetStats()

	for (const field of CONSULTING_PRESET_STAT_FIELDS) {
		const raw = basePresetStats[field.id] - fromContribution[field.id] + toContribution[field.id]
		// 입력 오차로 음수가 나와도 표시는 0 이상으로 맞춥니다.
		projected[field.id] = Math.max(0, roundPresetStatValue(raw))
	}

	return projected
}

/** 동료 loadout → 프리셋에 매핑되는 장착 기여분 */
export function getCompanionLoadoutPresetContribution(loadout: CompanionConsultingLoadout): ConsultingPresetStats {
	const effects = Object.values(loadout).flatMap((slot) => {
		if (!slot?.companionId) {
			return []
		}

		const companion = getCompanionById(slot.companionId)
		if (!companion) {
			return []
		}

		return [...resolveEquipEffects(companion.job, companion.grade, slot.level)]
	})

	return mapLabeledEffectsToPresetStats(aggregateEquipEffects(effects))
}

/**
 * 유물 loadout → 프리셋 기여분.
 * 잠재는 전부 상시, 각성은 scope 없는(상시) 수치만 반영합니다.
 * 조건부·연동 라벨(예: 크확 연동)은 매핑 테이블에 없어 자연히 제외됩니다.
 */
export function getRelicLoadoutPresetContribution(loadout: RelicConsultingLoadout): ConsultingPresetStats {
	const stats: RelicStatEffect[] = []

	for (const slot of Object.values(loadout)) {
		if (!slot?.relicId) {
			continue
		}

		const effects = resolveRelicEffects(slot.relicId, slot.stage)
		if (effects) {
			for (const stat of effects.stats) {
				// 상시만 — 월드보스·전투 시작 15초 등은 프리셋 추정에서 뺍니다.
				if (stat.scope) {
					continue
				}
				stats.push(stat)
			}
		}

		stats.push(...resolvePotentialStats(slot.potentialIds))
	}

	return mapLabeledEffectsToPresetStats(aggregateRelicStats(stats))
}

/** 동료: 현재 프리셋 + 현재/추천 loadout → 추천 적용 시 예상 프리셋 */
export function projectCompanionPresetStats(
	basePresetStats: ConsultingPresetStats,
	currentLoadout: CompanionConsultingLoadout,
	recommendedLoadout: CompanionConsultingLoadout
): ConsultingPresetStats {
	return projectPresetStatsAfterLoadoutSwap(
		basePresetStats,
		getCompanionLoadoutPresetContribution(currentLoadout),
		getCompanionLoadoutPresetContribution(recommendedLoadout)
	)
}

/** 유물: 잠재·상시 각성만 반영한 추천 적용 시 예상 프리셋 */
export function projectRelicPresetStats(
	basePresetStats: ConsultingPresetStats,
	currentLoadout: RelicConsultingLoadout,
	recommendedLoadout: RelicConsultingLoadout
): ConsultingPresetStats {
	return projectPresetStatsAfterLoadoutSwap(
		basePresetStats,
		getRelicLoadoutPresetContribution(currentLoadout),
		getRelicLoadoutPresetContribution(recommendedLoadout)
	)
}
