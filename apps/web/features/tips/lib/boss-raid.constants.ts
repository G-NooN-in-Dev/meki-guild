import { CONTENT_DIFFICULTIES } from '@/features/tips/lib/content-stage-cut.constants'
import type {
	BossRaidBoss,
	BossRaidDifficulty,
	BossRaidEntry,
	BossRaidMaterialReward,
	BossRaidMilestone,
	BossRaidReward,
	BossRaidRewardGrade,
	BossRaidRewardTier
} from '@/features/tips/types/boss-raid.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 보스레이드 난이도 — 일반 4단계 + 길드레이드 */
export const BOSS_RAID_DIFFICULTIES = [
	...CONTENT_DIFFICULTIES,
	{
		key: 'guild',
		label: '길드레이드',
		chipClassName: 'bg-pastel-blue-200 text-pastel-blue-900'
	}
] as const satisfies readonly { key: BossRaidDifficulty; label: string; chipClassName: string }[]

/** 보스 표시 메타 */
export const BOSS_RAID_BOSS_ORDER = ['zakum', 'horntail'] as const satisfies readonly BossRaidBoss[]

export const BOSS_RAID_BOSS_META = {
	zakum: { label: '자쿰' },
	horntail: { label: '혼테일' }
} as const satisfies Record<BossRaidBoss, { label: string }>

/** 장비 등급 Badge */
export const BOSS_RAID_REWARD_GRADE_META = {
	unique: {
		label: '유니크',
		badgeClassName: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800'
	},
	legendary: {
		label: '레전더리',
		badgeClassName: 'border-transparent bg-pastel-green-100 text-pastel-green-800'
	},
	legendaryPlus: {
		label: '레전더리+',
		badgeClassName: 'border-transparent bg-pastel-green-300 text-pastel-green-900'
	}
} as const satisfies Record<BossRaidRewardGrade, { label: string; badgeClassName: string }>

/** 장비 티어 라벨 */
export const BOSS_RAID_REWARD_TIER_LABELS = {
	top: '최상급',
	high: '상급',
	mid: '중급',
	low: '하급'
} as const satisfies Record<BossRaidRewardTier, string>

/** 재화·재료 이미지 — `public/items/` */
const BOSS_RAID_MATERIAL_IMAGE_SRC = {
	'시간 단축 티켓': '/items/time-reduce-ticket.png',
	'주문의 흔적': '/items/spell-trace.png',
	'무기 강화석': '/items/weapon-stone.png',
	'엘리트 몬스터 소환 포인트': '/items/elite-monster-point.png',
	메소: '/items/meso.png'
} as const satisfies Record<string, `/items/${string}.png`>

/** 장비 이미지 — `public/equipment/` */
const BOSS_RAID_EQUIPMENT_IMAGE_SRC = {
	'자쿰의 투구': '/equipments/zakum-helmet.png',
	'카오스 자쿰의 투구': '/equipments/zakum-helmet.png',
	'아쿠아틱 레터 눈장식': '/equipments/aquatic-letter-eye-accessory.png',
	'데아 시두스 이어링': '/equipments/dea-sidus-ear-ring.png',
	'혼테일의 목걸이': '/equipments/horntail-necklace.png',
	'카오스 혼테일의 목걸이': '/equipments/chaos-horntail-necklace.png'
} as const satisfies Record<string, `/equipments/${string}.png`>

/** 주문서 티어별 이미지 — `public/items/` */
const BOSS_RAID_SCROLL_TIER_IMAGE_SRC = {
	low: '/items/scroll-gray.png',
	mid: '/items/scroll-brown.png'
} as const satisfies Partial<Record<BossRaidRewardTier, `/items/${string}.png`>>

/** 훈장 이미지 — `public/items/` */
const BOSS_RAID_MEDAL_IMAGE_SRC = {
	'팀플레이어 훈장': '/medals/team-player-medal.jpg',
	'혼테일 원정대 훈장': '/medals/horntail-expedition-medal.jpg'
} as const satisfies Record<string, `/medals/${string}.jpg`>

/** 대부분 난이도에 공통으로 나오는 재화·재료 */
const COMMON_BOSS_RAID_MATERIALS = [
	{
		kind: 'material',
		name: '시간 단축 티켓',
		quantity: 300,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['시간 단축 티켓'],
		ratePercent: 3
	},
	{
		kind: 'material',
		name: '주문의 흔적',
		quantity: 600,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['주문의 흔적'],
		ratePercent: 7
	},
	{
		kind: 'material',
		name: '무기 강화석',
		quantity: 30_000,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['무기 강화석'],
		ratePercent: 10
	},
	{
		kind: 'material',
		name: '엘리트 몬스터 소환 포인트',
		quantity: 600,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['엘리트 몬스터 소환 포인트'],
		ratePercent: 16
	},
	{
		kind: 'material',
		name: '메소',
		quantity: 150_000,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC.메소,
		ratePercent: 35
	}
] as const satisfies readonly BossRaidMaterialReward[]

/**
 * 보스레이드 명중컷·보상 원본 데이터.
 * rewards 배열 순서는 입력 순서이며, UI에서 그룹·정렬합니다.
 */
export const BOSS_RAID_ENTRIES = [
	{
		boss: 'zakum',
		difficulty: 'easy',
		requiredHit: 110,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'high',
				maxLevel: 80,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'high',
				maxLevel: 80,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 4
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'normal',
		requiredHit: 150,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'hard',
		requiredHit: 230,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'chaos',
		requiredHit: 330,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 5
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'mid',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 20
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'guild',
		requiredHit: 190,
		rewardMode: 'milestone',
		milestones: [
			{
				hpPercent: 10,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 20,
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식']
			},
			{
				hpPercent: 30,
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구']
			},
			{
				hpPercent: 40,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 50,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 60,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식']
			},
			{
				hpPercent: 70,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구']
			},
			{
				hpPercent: 80,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 90,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 100,
				kind: 'medal',
				name: '팀플레이어 훈장',
				imageSrc: BOSS_RAID_MEDAL_IMAGE_SRC['팀플레이어 훈장']
			}
		]
	},
	{
		boss: 'horntail',
		difficulty: 'easy',
		requiredHit: 240,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'mid',
				maxLevel: 105,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 4
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'normal',
		requiredHit: 330,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'hard',
		requiredHit: 420,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 125,
				name: '카오스 혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['카오스 혼테일의 목걸이'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 125,
				name: '혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['혼테일의 목걸이'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'chaos',
		requiredHit: 510,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 125,
				name: '카오스 혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['카오스 혼테일의 목걸이'],
				ratePercent: 5
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 20
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'guild',
		requiredHit: 340,
		rewardMode: 'milestone',
		milestones: [
			{
				hpPercent: 10,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 20,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 30,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 40,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 50,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 60,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 70,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 80,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 90,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 100,
				kind: 'medal',
				name: '혼테일 원정대 훈장',
				imageSrc: BOSS_RAID_MEDAL_IMAGE_SRC['혼테일 원정대 훈장']
			}
		]
	}
] as const satisfies readonly BossRaidEntry[]

/** boss × difficulty 조회 */
function getBossRaidEntry(boss: BossRaidBoss, difficulty: BossRaidDifficulty): BossRaidEntry | undefined {
	return BOSS_RAID_ENTRIES.find((entry) => entry.boss === boss && entry.difficulty === difficulty)
}

/** 명중컷 요약표용 — boss별 difficulty → requiredHit */
function getBossRaidRequiredHit(boss: BossRaidBoss, difficulty: BossRaidDifficulty): number | undefined {
	return getBossRaidEntry(boss, difficulty)?.requiredHit
}

/** 장비·주문서 vs 재화·재료로 나누고 각각 정렬 */
function partitionBossRaidRewards(rewards: readonly BossRaidReward[]) {
	const primary = rewards
		.filter((reward) => reward.kind === 'equipment' || reward.kind === 'scroll')
		.sort((left, right) => left.ratePercent - right.ratePercent)
	const materials = rewards
		.filter((reward) => reward.kind === 'material')
		.sort((left, right) => right.ratePercent - left.ratePercent)

	return { primary, materials }
}

/** 보상 이름 */
function formatBossRaidRewardName(reward: BossRaidReward): string {
	if (reward.kind === 'scroll') {
		return `${reward.scrollName} (${BOSS_RAID_REWARD_TIER_LABELS[reward.tier]})`
	}

	return reward.name
}

/** 재화·재료 부가정보 - 수량 */
function getBossRaidMaterialQuantity(reward: BossRaidReward): string | undefined {
	if (reward.kind !== 'material') {
		return undefined
	}

	return formatLocaleNumber(reward.quantity)
}

/** 장비 부가정보 - 최대 레벨 */
function getBossRaidEquipmentMaxLevel(reward: BossRaidReward): string | undefined {
	if (reward.kind !== 'equipment') {
		return undefined
	}

	return formatLocaleNumber(reward.maxLevel)
}

/** 난이도 라벨 조회 */
function getBossRaidDifficultyLabel(difficulty: BossRaidDifficulty): string {
	return BOSS_RAID_DIFFICULTIES.find((item) => item.key === difficulty)?.label ?? difficulty
}

/** 길드레이드 마일스톤 보상 이름 */
function formatBossRaidMilestoneRewardName(milestone: BossRaidMilestone): string {
	if (milestone.kind === 'scroll') {
		return `${milestone.scrollName} (${BOSS_RAID_REWARD_TIER_LABELS[milestone.tier]}) ${formatLocaleNumber(milestone.quantity)}개`
	}

	return milestone.name
}

/** 길드레이드 마일스톤 장비 최대 레벨 */
function getBossRaidMilestoneEquipmentMaxLevel(milestone: BossRaidMilestone): string | undefined {
	if (milestone.kind !== 'equipment') {
		return undefined
	}

	return formatLocaleNumber(milestone.maxLevel)
}

export {
	formatBossRaidMilestoneRewardName,
	formatBossRaidRewardName,
	getBossRaidDifficultyLabel,
	getBossRaidEntry,
	getBossRaidEquipmentMaxLevel,
	getBossRaidMaterialQuantity,
	getBossRaidMilestoneEquipmentMaxLevel,
	getBossRaidRequiredHit,
	partitionBossRaidRewards
}
