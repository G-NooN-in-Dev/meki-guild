import { CONTENT_DIFFICULTIES } from '@/features/tips/lib/content-stage-cut.constants'
import { ITEM_GRADE_BADGE_CLASS } from '@/features/tips/lib/item-grade.constants'
import { PARTY_QUEST_ENTRIES } from '@/features/tips/lib/party-quest-entries.data'
import type {
	PartyQuestBonusOptionCountRates,
	PartyQuestDifficulty,
	PartyQuestEntry,
	PartyQuestEquipmentReward,
	PartyQuestId,
	PartyQuestMaterialReward,
	PartyQuestRewardGrade,
	PartyQuestRewardTier
} from '@/features/tips/types/party-quest.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 파티퀘스트 난이도 — 컨텐츠 공통 4단계 */
export const PARTY_QUEST_DIFFICULTIES = CONTENT_DIFFICULTIES

/** 퀘스트 표시 순서 */
export const PARTY_QUEST_ORDER = [
	'ring',
	'necklace',
	'faceAccessory',
	'ring2'
] as const satisfies readonly PartyQuestId[]

export const PARTY_QUEST_META = {
	ring: { label: '첫 번째 동행', imageSrc: '/monsters/king-slime.gif' },
	necklace: { label: '차원의 균열', imageSrc: '/monsters/alishar.gif' },
	faceAccessory: { label: '여신의 흔적', imageSrc: '/monsters/papa-pixie.gif' },
	ring2: { label: '로미오와 줄리엣', imageSrc: '/monsters/frankenroid.gif' }
} as const satisfies Record<PartyQuestId, { label: string; imageSrc: `/monsters/${string}` }>

/** 장비 등급 Badge — ItemGrade 톤 재사용 */
export const PARTY_QUEST_REWARD_GRADE_META = {
	epic: {
		label: '에픽',
		badgeClassName: ITEM_GRADE_BADGE_CLASS.epic
	},
	unique: {
		label: '유니크',
		badgeClassName: ITEM_GRADE_BADGE_CLASS.unique
	},
	legendary: {
		label: '레전더리',
		badgeClassName: ITEM_GRADE_BADGE_CLASS.legendary
	}
} as const satisfies Record<PartyQuestRewardGrade, { label: string; badgeClassName: string }>

export const PARTY_QUEST_REWARD_TIER_LABELS = {
	top: '최상급',
	high: '상급',
	mid: '중급',
	low: '하급'
} as const satisfies Record<PartyQuestRewardTier, string>

/**
 * 장비 획득 확률(%) — 전 파티퀘스트·난이도 공통.
 * 버닝 시 장비 확률을 올리고, 남은 비율을 기타 재화가 기존 비중대로 나눈다.
 */
export const PARTY_QUEST_EQUIPMENT_RATES = {
	easy: { normal: 25, burning: 35 },
	normal: { normal: 20, burning: 30 },
	hard: { normal: 20, burning: 30 },
	chaos: { normal: 20, burning: 30 }
} as const satisfies Record<PartyQuestDifficulty, { normal: number; burning: number }>

/** 부가옵션 개수 확률 — 전 파티퀘스트 장비 공통 */
export const PARTY_QUEST_BONUS_OPTION_COUNT_RATES = [
	0, 40, 40, 20, 0
] as const satisfies PartyQuestBonusOptionCountRates

function getPartyQuestEntry(quest: PartyQuestId, difficulty: PartyQuestDifficulty): PartyQuestEntry | undefined {
	return PARTY_QUEST_ENTRIES.find((entry) => entry.quest === quest && entry.difficulty === difficulty)
}

function getPartyQuestRequiredHit(quest: PartyQuestId, difficulty: PartyQuestDifficulty): number | undefined {
	return getPartyQuestEntry(quest, difficulty)?.requiredHit
}

function getPartyQuestEquipmentRatePercent(difficulty: PartyQuestDifficulty, burningOn: boolean) {
	const rates = PARTY_QUEST_EQUIPMENT_RATES[difficulty]

	return burningOn ? rates.burning : rates.normal
}

/**
 * 버닝 이벤트 — 장비 확률은 난이도 고정값, 남은 비율을 기타 재화가 기존 비중대로 나눔.
 * 총합은 100%를 넘지 않는다.
 */
function applyPartyQuestBurningRates(
	difficulty: PartyQuestDifficulty,
	materials: readonly PartyQuestMaterialReward[],
	burningOn: boolean
) {
	const equipmentRate = getPartyQuestEquipmentRatePercent(difficulty, burningOn)

	if (!burningOn) {
		return { equipmentRate, materials }
	}

	const remaining = Math.max(0, 100 - equipmentRate)
	const materialBaseSum = materials.reduce((sum, material) => sum + material.ratePercent, 0)

	const burnedMaterials = materials.map((material) => ({
		...material,
		ratePercent: materialBaseSum === 0 ? 0 : (material.ratePercent / materialBaseSum) * remaining
	}))

	return { equipmentRate, materials: burnedMaterials }
}

/** 기타 재화 — 확률 높은 순 */
function sortPartyQuestMaterials(materials: readonly PartyQuestMaterialReward[]) {
	return [...materials].sort((left, right) => right.ratePercent - left.ratePercent)
}

function formatPartyQuestRatePercent(value: number) {
	return `${Math.round(value)}%`
}

function getPartyQuestMaterialQuantity(material: PartyQuestMaterialReward) {
	return formatLocaleNumber(material.quantity)
}

function getPartyQuestEquipmentMaxLevel(equipment: PartyQuestEquipmentReward) {
	return formatLocaleNumber(equipment.maxLevel)
}

function getPartyQuestDifficultyLabel(difficulty: PartyQuestDifficulty): string {
	return PARTY_QUEST_DIFFICULTIES.find((item) => item.key === difficulty)?.label ?? difficulty
}

export {
	applyPartyQuestBurningRates,
	formatPartyQuestRatePercent,
	getPartyQuestDifficultyLabel,
	getPartyQuestEntry,
	getPartyQuestEquipmentMaxLevel,
	getPartyQuestEquipmentRatePercent,
	getPartyQuestMaterialQuantity,
	getPartyQuestRequiredHit,
	PARTY_QUEST_ENTRIES,
	sortPartyQuestMaterials
}
