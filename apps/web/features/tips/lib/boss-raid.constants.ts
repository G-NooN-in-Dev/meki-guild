import { BOSS_RAID_ENTRIES } from '@/features/tips/lib/boss-raid-entries.data'
import { CONTENT_DIFFICULTIES } from '@/features/tips/lib/content-stage-cut.constants'
import type {
	BossRaidBonusOptionCountRates,
	BossRaidBoss,
	BossRaidDifficulty,
	BossRaidEntry,
	BossRaidEquipmentReward,
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
export const BOSS_RAID_BOSS_ORDER = ['zakum', 'horntail', 'pinkBean'] as const satisfies readonly BossRaidBoss[]

export const BOSS_RAID_BOSS_META = {
	zakum: { label: '자쿰', imageSrc: '/monsters/zakum.gif' },
	horntail: { label: '혼테일', imageSrc: '/monsters/horntail.gif' },
	pinkBean: { label: '핑크빈', imageSrc: '/monsters/pink-bean.gif' }
} as const satisfies Record<BossRaidBoss, { label: string; imageSrc: `/monsters/${string}` }>

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

/**
 * 장비 부가옵션 개수(0~4개) 확률(%) — 이름 × 등급 기준.
 * tier·maxLevel과 무관하며, 데이터가 없는 장비는 룩업에서 제외한다.
 * `reward.name`(string) 인덱싱을 위해 Record로 둔다. (`as const`면 키가 리터럴로 좁혀져 에러)
 */
const BOSS_RAID_BONUS_OPTION_COUNT_RATES: Record<
	string,
	Partial<Record<BossRaidRewardGrade, BossRaidBonusOptionCountRates>>
> = {
	'자쿰의 투구': {
		unique: [30, 40, 30, 0, 0],
		legendary: [30, 35, 25, 10, 0]
	},
	'카오스 자쿰의 투구': {
		legendary: [30, 35, 25, 10, 0]
	},
	'아쿠아틱 레터 눈장식': {
		unique: [0, 30, 40, 30, 0],
		legendary: [0, 30, 35, 25, 10]
	},
	'데아 시두스 이어링': {
		legendary: [30, 35, 25, 10, 0],
		legendaryPlus: [30, 35, 25, 10, 0]
	},
	'혼테일의 목걸이': {
		legendaryPlus: [30, 35, 25, 10, 0]
	},
	'카오스 혼테일의 목걸이': {
		legendaryPlus: [30, 35, 25, 10, 0]
	},
	'핑크빛 성배': {
		legendary: [0, 30, 40, 30, 0],
		legendaryPlus: [0, 30, 35, 25, 10]
	},
	'블랙빈 마크': {
		legendaryPlus: [30, 35, 25, 10, 0]
	},
	'카오스 핑크빈 마크': {
		legendaryPlus: [30, 35, 25, 10, 0]
	}
}

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

/**
 * 버닝 이벤트 — 장비/주문서 확률 2배, 남은 비율을 기타 재화가 기존 비중대로 나눔.
 * 총합은 100%를 넘지 않는다.
 */
function applyBossRaidBurningRates(rewards: readonly BossRaidReward[]): BossRaidReward[] {
	const primary = rewards.filter((reward) => reward.kind === 'equipment' || reward.kind === 'scroll')
	const materials = rewards.filter((reward) => reward.kind === 'material')

	const burnedPrimary = primary.map((reward) => ({
		...reward,
		ratePercent: reward.ratePercent * 2
	}))
	const primarySum = burnedPrimary.reduce((sum, reward) => sum + reward.ratePercent, 0)
	const remaining = Math.max(0, 100 - primarySum)
	const materialBaseSum = materials.reduce((sum, reward) => sum + reward.ratePercent, 0)

	const burnedMaterials = materials.map((reward) => ({
		...reward,
		ratePercent: materialBaseSum === 0 ? 0 : (reward.ratePercent / materialBaseSum) * remaining
	}))

	return [...burnedPrimary, ...burnedMaterials]
}

/** 확률(%) 표시 — 소수점은 반올림해 정수로 표시 (모바일 셀 너비) */
function formatBossRaidRatePercent(value: number) {
	return `${Math.round(value)}%`
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

/** 장비 부가옵션 개수 확률 — 이름 × 등급 룩업 */
function getBossRaidBonusOptionCountRates(
	reward: Pick<BossRaidEquipmentReward, 'kind' | 'name' | 'grade'>
): BossRaidBonusOptionCountRates | undefined {
	if (reward.kind !== 'equipment') {
		return undefined
	}

	return BOSS_RAID_BONUS_OPTION_COUNT_RATES[reward.name]?.[reward.grade]
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
	applyBossRaidBurningRates,
	BOSS_RAID_ENTRIES,
	formatBossRaidMilestoneRewardName,
	formatBossRaidRatePercent,
	formatBossRaidRewardName,
	getBossRaidBonusOptionCountRates,
	getBossRaidDifficultyLabel,
	getBossRaidEntry,
	getBossRaidEquipmentMaxLevel,
	getBossRaidMaterialQuantity,
	getBossRaidMilestoneEquipmentMaxLevel,
	getBossRaidRequiredHit,
	partitionBossRaidRewards
}
