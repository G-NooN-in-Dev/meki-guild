import type { ContentDifficulty } from '@/features/tips/types/content-stage-cut.type'

type PartyQuestId = 'ring' | 'necklace' | 'faceAccessory' | 'ring2'

type PartyQuestDifficulty = ContentDifficulty

type PartyQuestRewardGrade = 'epic' | 'unique' | 'legendary'

type PartyQuestRewardTier = 'top' | 'high' | 'mid' | 'low'

/** 부가옵션 개수(0~4개)별 확률(%) — 파티퀘스트 공통 */
type PartyQuestBonusOptionCountRates = readonly [number, number, number, number, number]

type PartyQuestEquipmentReward = {
	kind: 'equipment'
	grade: PartyQuestRewardGrade
	tier: PartyQuestRewardTier
	maxLevel: number
	name: string
	imageSrc: string
}

type PartyQuestMaterialReward = {
	kind: 'material'
	name: string
	quantity: number
	imageSrc: string
	ratePercent: number
}

type PartyQuestEntry = {
	quest: PartyQuestId
	difficulty: PartyQuestDifficulty
	requiredHit: number
	equipment: PartyQuestEquipmentReward
	materials: readonly PartyQuestMaterialReward[]
}

type PartyQuestSelection = {
	quest: PartyQuestId
	difficulty: PartyQuestDifficulty
}

export type {
	PartyQuestBonusOptionCountRates,
	PartyQuestDifficulty,
	PartyQuestEntry,
	PartyQuestEquipmentReward,
	PartyQuestId,
	PartyQuestMaterialReward,
	PartyQuestRewardGrade,
	PartyQuestRewardTier,
	PartyQuestSelection
}
