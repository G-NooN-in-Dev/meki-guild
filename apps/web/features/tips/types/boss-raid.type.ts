import type { ContentDifficulty } from '@/features/tips/types/content-stage-cut.type'

type BossRaidBoss = 'zakum' | 'horntail'

type BossRaidRewardGrade = 'unique' | 'legendary' | 'legendaryPlus'

type BossRaidRewardTier = 'top' | 'high' | 'mid' | 'low'

type BossRaidEquipmentReward = {
	kind: 'equipment'
	grade: BossRaidRewardGrade
	tier: BossRaidRewardTier
	maxLevel: number
	name: string
	imageSrc: string
	ratePercent: number
}

type BossRaidScrollReward = {
	kind: 'scroll'
	scrollName: string
	tier: BossRaidRewardTier
	imageSrc: string
	ratePercent: number
}

type BossRaidMaterialReward = {
	kind: 'material'
	name: string
	quantity: number
	imageSrc: string
	ratePercent: number
}

type BossRaidReward = BossRaidEquipmentReward | BossRaidScrollReward | BossRaidMaterialReward

type BossRaidEntry = {
	boss: BossRaidBoss
	difficulty: ContentDifficulty
	requiredHit: number
	rewards: readonly BossRaidReward[]
}

type BossRaidSelection = {
	boss: BossRaidBoss
	difficulty: ContentDifficulty
}

export type {
	BossRaidBoss,
	BossRaidEntry,
	BossRaidEquipmentReward,
	BossRaidMaterialReward,
	BossRaidReward,
	BossRaidRewardGrade,
	BossRaidRewardTier,
	BossRaidScrollReward,
	BossRaidSelection
}
