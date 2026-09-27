/**
 * 등급 표 공통 헬퍼.
 * 토벌전·월드보스(등수+점수)·무기 등 등급 목록 기반 비교에 사용합니다.
 */

/** 밴드(구간) UI 톤 — 헤더 배경·라벨색, 등급명 텍스트색 */
type GradeBandMeta = {
	label: string
	headerClassName: string
	textClassName: string
}

/** 등수·최소 점수로 자격이 정해지는 등급 행 */
type PlacementScoreTier = {
	rank: string
	/** null이면 등수 제한 없음(점수만) */
	maxPlacement: number | null
	minScore: number
}

/**
 * 상위 구간부터 등수·최소 점수를 만족하는 첫 등급명을 반환합니다.
 */
function getGradeFromPlacementScore(
	tiers: readonly PlacementScoreTier[],
	placement: number | null,
	score: bigint
): string | null {
	if (score <= 0n) {
		return null
	}

	for (const tier of tiers) {
		if (score < BigInt(tier.minScore)) {
			continue
		}

		if (tier.maxPlacement !== null) {
			if (placement === null || placement <= 0 || placement > tier.maxPlacement) {
				continue
			}
		}

		return tier.rank
	}

	return null
}

/**
 * 등급명 → 1-based 순위.
 * `ranks`는 상위 등급부터 나열된 목록이어야 합니다.
 */
function getGradeRankFromList(ranks: readonly string[], grade: string): number | null {
	const index = ranks.findIndex((entry) => entry === grade)

	return index === -1 ? null : index + 1
}

/**
 * 직전 대비 등급 단계 차이.
 * 양수=상승(목록 앞쪽), 음수=하락, 0=동일. 한쪽이라도 미매칭이면 null.
 */
function getGradeDiffFromRanks(
	getRank: (grade: string) => number | null,
	previous: string,
	current: string
): number | null {
	const previousRank = getRank(previous)
	const currentRank = getRank(current)

	if (previousRank === null || currentRank === null) {
		return null
	}

	return previousRank - currentRank
}

/**
 * 등급 라벨 → 밴드 텍스트 class.
 * 빈 값(`-`)은 grayscale-400, 밴드 미매칭은 빈 문자열.
 */
function getGradeTextClassFromBand<TBand extends string>(
	grade: string,
	getBand: (grade: string) => TBand | null,
	bandMeta: Record<TBand, GradeBandMeta>
): string {
	if (!grade || grade === '-') {
		return 'text-grayscale-400'
	}

	const band = getBand(grade)

	return band ? bandMeta[band].textClassName : ''
}

/**
 * 접두사 목록으로 밴드를 고릅니다.
 * 긴 접두사를 앞에 두세요. (예: `그랜드마스터` → `마스터`보다 먼저)
 */
function getBandByPrefix<TBand extends string>(
	grade: string,
	prefixes: readonly { prefix: string; band: TBand }[]
): TBand | null {
	if (!grade || grade === '-') {
		return null
	}

	for (const { prefix, band } of prefixes) {
		if (grade.startsWith(prefix)) {
			return band
		}
	}

	return null
}

export {
	getBandByPrefix,
	getGradeDiffFromRanks,
	getGradeFromPlacementScore,
	getGradeRankFromList,
	getGradeTextClassFromBand
}
export type { GradeBandMeta, PlacementScoreTier }
