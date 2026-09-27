import {
	getGradeDiffFromRanks,
	getGradeFromPlacementScore,
	getGradeRankFromList,
	type PlacementScoreTier
} from '@/libs/grade-tier.helpers'

type ExpeditionGuildTier = PlacementScoreTier & {
	points: number
}

/**
 * 토벌전 등급·포인트 기준표 (상위 등급부터).
 * - maxPlacement: 이 등수 이내 + minScore 이상이어야 해당 등급
 * - maxPlacement null: 점수만으로 자격
 */
export const EXPEDITION_GUILD_TIERS = [
	{ rank: '챔피언1', points: 1_000_000, maxPlacement: 1, minScore: 50_000_000 },
	{ rank: '챔피언2', points: 800_000, maxPlacement: 2, minScore: 50_000_000 },
	{ rank: '챔피언3', points: 600_000, maxPlacement: 3, minScore: 50_000_000 },
	{ rank: '챌린저1', points: 500_000, maxPlacement: 10, minScore: 50_000_000 },
	{ rank: '챌린저2', points: 450_000, maxPlacement: 30, minScore: 50_000_000 },
	{ rank: '챌린저3', points: 400_000, maxPlacement: 50, minScore: 50_000_000 },
	{ rank: '챌린저4', points: 350_000, maxPlacement: 70, minScore: 50_000_000 },
	{ rank: '챌린저5', points: 300_000, maxPlacement: 100, minScore: 50_000_000 },
	{ rank: '그랜드마스터1', points: 250_000, maxPlacement: 150, minScore: 45_000_000 },
	{ rank: '그랜드마스터2', points: 225_000, maxPlacement: 200, minScore: 40_000_000 },
	{ rank: '그랜드마스터3', points: 200_000, maxPlacement: 250, minScore: 35_000_000 },
	{ rank: '그랜드마스터4', points: 175_000, maxPlacement: 350, minScore: 30_000_000 },
	{ rank: '그랜드마스터5', points: 150_000, maxPlacement: 500, minScore: 25_000_000 },
	{ rank: '마스터1', points: 125_000, maxPlacement: 1000, minScore: 20_000_000 },
	{ rank: '마스터2', points: 110_000, maxPlacement: 2000, minScore: 17_500_000 },
	{ rank: '마스터3', points: 95_000, maxPlacement: 3000, minScore: 15_000_000 },
	{ rank: '마스터4', points: 80_000, maxPlacement: 5000, minScore: 12_500_000 },
	{ rank: '마스터5', points: 65_000, maxPlacement: null, minScore: 10_000_000 },
	{ rank: '다이아몬드1', points: 50_000, maxPlacement: null, minScore: 3_000_000 },
	{ rank: '플래티넘1', points: 40_000, maxPlacement: null, minScore: 1_500_000 },
	{ rank: '골드1', points: 30_000, maxPlacement: null, minScore: 500_000 },
	{ rank: '실버1', points: 20_000, maxPlacement: null, minScore: 200_000 },
	{ rank: '브론즈1', points: 10_000, maxPlacement: null, minScore: 1 }
] as const satisfies readonly ExpeditionGuildTier[]

const EXPEDITION_GRADE_RANKS = EXPEDITION_GUILD_TIERS.map((tier) => tier.rank)

/** 등수·점수 → 토벌전 등급명 */
function getExpeditionGradeFromStats(placement: number | null, score: bigint): string | null {
	return getGradeFromPlacementScore(EXPEDITION_GUILD_TIERS, placement, score)
}

/**
 * 토벌전 등급명 → 순위(1=챔피언1 최상위 … 브론즈1 최하위).
 * 길드원 개인 등급·길드 순위 등급 모두 동일한 명칭 체계를 사용합니다.
 */
function getExpeditionGradeRank(grade: string): number | null {
	return getGradeRankFromList(EXPEDITION_GRADE_RANKS, grade)
}

/**
 * 직전 대비 등급 변화 단계.
 * 양수=상승(챔피언1 방향), 음수=하락(브론즈1 방향), 0=동일.
 */
function getExpeditionGradeDiff(previous: string, current: string): number | null {
	return getGradeDiffFromRanks(getExpeditionGradeRank, previous, current)
}

function getExpeditionGradePoints(grade: string): number {
	return EXPEDITION_GUILD_TIERS.find((tier) => tier.rank === grade)?.points ?? 0
}

/**
 * 길드원 개인 토벌전 등급에 부여된 포인트를 모두 합산합니다.
 * (길드 내 점수 순위별 포인트와는 별개)
 */
function sumExpeditionGradePoints(grades: readonly string[]): number {
	return grades.reduce((sum, grade) => sum + getExpeditionGradePoints(grade), 0)
}

export { getExpeditionGradeDiff, getExpeditionGradeFromStats, getExpeditionGradeRank, sumExpeditionGradePoints }
export type { ExpeditionGuildTier }
