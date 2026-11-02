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

/**
 * 몬스터별 원본 수치.
 * 2칸은 일반·보스, 3칸은 일반·중간보스·최종보스 순서입니다.
 * 화면에는 이 중 최댓값만 안내합니다.
 */
type PartyQuestMonsterValues = readonly [number, number] | readonly [number, number, number]

type PartyQuestEntry = {
	quest: PartyQuestId
	difficulty: PartyQuestDifficulty
	requiredHit: PartyQuestMonsterValues
	defense: PartyQuestMonsterValues
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
	PartyQuestMonsterValues,
	PartyQuestRewardGrade,
	PartyQuestRewardTier,
	PartyQuestSelection
}
