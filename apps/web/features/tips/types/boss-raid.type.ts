import type { ContentDifficulty } from '@/features/tips/types/content-stage-cut.type'

type BossRaidBoss = 'zakum' | 'horntail'

/** 보스레이드 전용 난이도 — 길드레이드는 마일스톤 확정 보상 */
type BossRaidDifficulty = ContentDifficulty | 'guild'

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

type BossRaidMedalReward = {
	kind: 'medal'
	name: string
	imageSrc: string
}

/** 길드레이드 — 체력 % 구간별 확정 보상 */
type BossRaidMilestone = {
	hpPercent: number
} & (
	| Omit<BossRaidEquipmentReward, 'ratePercent'>
	| (Omit<BossRaidScrollReward, 'ratePercent'> & { quantity: number })
	| BossRaidMedalReward
)

type BossRaidEntryBase = {
	boss: BossRaidBoss
	difficulty: BossRaidDifficulty
	requiredHit: number
}

type BossRaidProbabilityEntry = BossRaidEntryBase & {
	rewardMode: 'probability'
	rewards: readonly BossRaidReward[]
}

type BossRaidMilestoneEntry = BossRaidEntryBase & {
	rewardMode: 'milestone'
	milestones: readonly BossRaidMilestone[]
}

type BossRaidEntry = BossRaidProbabilityEntry | BossRaidMilestoneEntry

type BossRaidSelection = {
	boss: BossRaidBoss
	difficulty: BossRaidDifficulty
}

export type {
	BossRaidBoss,
	BossRaidDifficulty,
	BossRaidEntry,
	BossRaidEquipmentReward,
	BossRaidMaterialReward,
	BossRaidMedalReward,
	BossRaidMilestone,
	BossRaidReward,
	BossRaidRewardGrade,
	BossRaidRewardTier,
	BossRaidScrollReward,
	BossRaidSelection
}
