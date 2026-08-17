type RivalryRankPointBand = {
	fromRank: number
	toRank: number
	/** 이 구간에 들어올 때(2위부터) 한 단계당 빠지는 포인트 */
	step: number
}

type RivalryRankPointEntry = {
	rank: number
	points: number
}

/** 표 UI용 색 구간. 상위일수록 따뜻한 톤입니다. */
type RivalryRankPointTone = 'top' | 'high' | 'mid' | 'low' | 'bottom'

/**
 * 구간별 UI 톤.
 * 헤더는 배경+라벨색, 순위는 텍스트색 + 한 단계 올린 두께를 씁니다.
 */
const RIVALRY_RANK_POINT_TONE_META = {
	top: {
		headerClassName: 'bg-pastel-red-50 text-pastel-red-800',
		textClassName: 'font-semibold text-pastel-red-800'
	},
	high: {
		headerClassName: 'bg-pastel-orange-50 text-pastel-orange-800',
		textClassName: 'font-semibold text-pastel-orange-800'
	},
	mid: {
		headerClassName: 'bg-pastel-green-50 text-pastel-green-800',
		textClassName: 'font-semibold text-pastel-green-800'
	},
	low: {
		headerClassName: 'bg-pastel-blue-50 text-pastel-blue-800',
		textClassName: 'font-semibold text-pastel-blue-800'
	},
	bottom: {
		headerClassName: 'bg-pastel-purple-100 text-pastel-purple-600',
		textClassName: 'font-semibold text-pastel-purple-700'
	}
} as const satisfies Record<RivalryRankPointTone, { headerClassName: string; textClassName: string }>

function getRivalryRankPointTone(rank: number): RivalryRankPointTone {
	if (rank <= 10) {
		return 'top'
	}

	if (rank <= 30) {
		return 'high'
	}

	if (rank <= 50) {
		return 'mid'
	}

	if (rank <= 99) {
		return 'low'
	}

	return 'bottom'
}

function getRivalryRankPointTextClass(rank: number): string {
	return RIVALRY_RANK_POINT_TONE_META[getRivalryRankPointTone(rank)].textClassName
}

/** 1위 포인트. 이후 순위는 구간 step만큼 줄어듭니다. */
const RIVALRY_RANK_POINT_START = 1_000_000

/**
 * 대항전 개인 순위 → 길드 포인트 규칙.
 * 구간이 바뀌면 감소폭(step)만 달라지고, 값은 직전 순위에서 이어집니다.
 */
const RIVALRY_RANK_POINT_BANDS = [
	{ fromRank: 1, toRank: 3, step: 100_000 },
	{ fromRank: 4, toRank: 5, step: 70_000 },
	{ fromRank: 6, toRank: 10, step: 50_000 },
	{ fromRank: 11, toRank: 15, step: 30_000 },
	{ fromRank: 16, toRank: 20, step: 10_000 },
	{ fromRank: 21, toRank: 30, step: 5_000 },
	{ fromRank: 31, toRank: 40, step: 3_000 },
	{ fromRank: 41, toRank: 50, step: 2_000 },
	{ fromRank: 51, toRank: 99, step: 1_000 },
	{ fromRank: 100, toRank: 150, step: 700 }
] as const satisfies readonly RivalryRankPointBand[]

function buildRivalryRankPointEntries(
	bands: readonly RivalryRankPointBand[] = RIVALRY_RANK_POINT_BANDS
): RivalryRankPointEntry[] {
	let points = RIVALRY_RANK_POINT_START
	let expectedRank = 1
	const entries: RivalryRankPointEntry[] = []

	for (const { fromRank, toRank, step } of bands) {
		if (fromRank !== expectedRank || toRank < fromRank || step <= 0) {
			throw new Error(`대항전 순위 포인트 구간이 올바르지 않습니다: ${fromRank}~${toRank}`)
		}

		for (let rank = fromRank; rank <= toRank; rank += 1) {
			if (rank > 1) {
				points -= step
			}

			entries.push({ rank, points })
		}

		expectedRank = toRank + 1
	}

	return entries
}

const RIVALRY_RANK_POINT_ENTRIES = buildRivalryRankPointEntries()

function getRivalryRankPoints(rank: number): number | null {
	if (!Number.isInteger(rank) || rank < 1) {
		return null
	}

	const entry = RIVALRY_RANK_POINT_ENTRIES[rank - 1]

	return entry?.rank === rank ? entry.points : null
}

export {
	getRivalryRankPoints,
	getRivalryRankPointTextClass,
	getRivalryRankPointTone,
	RIVALRY_RANK_POINT_BANDS,
	RIVALRY_RANK_POINT_ENTRIES,
	RIVALRY_RANK_POINT_START,
	RIVALRY_RANK_POINT_TONE_META
}
export type { RivalryRankPointBand, RivalryRankPointEntry, RivalryRankPointTone }
