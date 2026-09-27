/**
 * 월드보스 등급 기준표.
 * 토벌전·월드보스 공통 밴드/헬퍼는 `content-tier-band` · `grade-tier.helpers`를 사용합니다.
 */

import {
	getGradeDiffFromRanks,
	getGradeFromPlacementScore,
	getGradeRankFromList,
	type PlacementScoreTier
} from '@/libs/grade-tier.helpers'

type WorldBossTier = PlacementScoreTier

/**
 * 월드보스 등급 기준표 (상위 등급부터).
 * - maxPlacement: 이 등수 이내 + minScore 이상이어야 해당 등급
 * - maxPlacement null: 점수만으로 자격
 */
export const WORLD_BOSS_TIERS = [
	{ rank: '챔피언1', maxPlacement: 1, minScore: 100_000_000 },
	{ rank: '챔피언2', maxPlacement: 2, minScore: 100_000_000 },
	{ rank: '챔피언3', maxPlacement: 3, minScore: 100_000_000 },
	{ rank: '챌린저1', maxPlacement: 10, minScore: 100_000_000 },
	{ rank: '챌린저2', maxPlacement: 30, minScore: 100_000_000 },
	{ rank: '챌린저3', maxPlacement: 50, minScore: 100_000_000 },
	{ rank: '챌린저4', maxPlacement: 70, minScore: 100_000_000 },
	{ rank: '챌린저5', maxPlacement: 100, minScore: 100_000_000 },
	{ rank: '그랜드마스터1', maxPlacement: 150, minScore: 100_000_000 },
	{ rank: '그랜드마스터2', maxPlacement: 200, minScore: 100_000_000 },
	{ rank: '그랜드마스터3', maxPlacement: 250, minScore: 100_000_000 },
	{ rank: '그랜드마스터4', maxPlacement: 350, minScore: 100_000_000 },
	{ rank: '그랜드마스터5', maxPlacement: 500, minScore: 100_000_000 },
	{ rank: '마스터1', maxPlacement: 1000, minScore: 100_000_000 },
	{ rank: '마스터2', maxPlacement: 2000, minScore: 100_000_000 },
	{ rank: '마스터3', maxPlacement: 3000, minScore: 100_000_000 },
	{ rank: '마스터4', maxPlacement: 5000, minScore: 30_000_000 },
	{ rank: '마스터5', maxPlacement: null, minScore: 10_000_000 },
	{ rank: '다이아몬드1', maxPlacement: null, minScore: 3_000_000 },
	{ rank: '플래티넘1', maxPlacement: null, minScore: 1_000_000 },
	{ rank: '골드1', maxPlacement: null, minScore: 300_000 },
	{ rank: '실버1', maxPlacement: null, minScore: 100_000 },
	{ rank: '브론즈1', maxPlacement: null, minScore: 1 }
] as const satisfies readonly WorldBossTier[]

const WORLD_BOSS_GRADE_RANKS = WORLD_BOSS_TIERS.map((tier) => tier.rank)

/** 등수·점수 → 월드보스 등급명 */
function getWorldBossGradeFromStats(placement: number | null, score: bigint): string | null {
	return getGradeFromPlacementScore(WORLD_BOSS_TIERS, placement, score)
}

/** 월드보스 등급명 → 순위(1=챔피언1 최상위 … 브론즈1 최하위) */
function getWorldBossGradeRank(grade: string): number | null {
	return getGradeRankFromList(WORLD_BOSS_GRADE_RANKS, grade)
}

/**
 * 등급 변화 단계.
 * 양수=상승(챔피언1 방향), 음수=하락(브론즈1 방향), 0=동일.
 */
function getWorldBossGradeDiff(previous: string, current: string): number | null {
	return getGradeDiffFromRanks(getWorldBossGradeRank, previous, current)
}

export { getWorldBossGradeDiff, getWorldBossGradeFromStats, getWorldBossGradeRank }
export type { WorldBossTier }
