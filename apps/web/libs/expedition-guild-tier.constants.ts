export type ExpeditionGuildTier = {
	rank: string
	points: number
	/** 해당 등급을 얻기 위해 들어야 하는 최대 등수. null이면 등수 제한 없음. */
	maxPlacement: number | null
}

/** 토벌전 등급 UI 구간 (챌린저 / 그랜드마스터 / 마스터) */
export type ExpeditionTierBand = 'challenger' | 'grandmaster' | 'master'

/**
 * 구간별 UI 톤.
 * 헤더는 배경+라벨색, 등급명은 텍스트색 + 한 단계 올린 두께를 씁니다.
 */
export const EXPEDITION_TIER_BAND_META = {
	challenger: {
		label: '챌린저',
		headerClassName: 'bg-pastel-orange-50 text-pastel-orange-800',
		textClassName: 'font-semibold text-pastel-orange-800'
	},
	grandmaster: {
		label: '그랜드마스터',
		headerClassName: 'bg-pastel-blue-50 text-pastel-blue-800',
		textClassName: 'font-semibold text-pastel-blue-800'
	},
	master: {
		label: '마스터',
		headerClassName: 'bg-pastel-purple-100 text-pastel-purple-600',
		textClassName: 'font-semibold text-pastel-purple-700'
	}
} as const satisfies Record<ExpeditionTierBand, { label: string; headerClassName: string; textClassName: string }>

/**
 * 토벌전 점수 순위에 따른 길드 등급·포인트 기준표.
 * 1위부터 순서대로 적용됩니다.
 * maxPlacement: 이 등수 이내에 들어야 해당 등급 최소 자격이 주어집니다.
 */
export const EXPEDITION_GUILD_TIERS = [
	{ rank: '챌린저1', points: 500_000, maxPlacement: 10 },
	{ rank: '챌린저2', points: 450_000, maxPlacement: 30 },
	{ rank: '챌린저3', points: 400_000, maxPlacement: 50 },
	{ rank: '챌린저4', points: 350_000, maxPlacement: 70 },
	{ rank: '챌린저5', points: 300_000, maxPlacement: 100 },
	{ rank: '그랜드마스터1', points: 250_000, maxPlacement: 150 },
	{ rank: '그랜드마스터2', points: 225_000, maxPlacement: 200 },
	{ rank: '그랜드마스터3', points: 200_000, maxPlacement: 250 },
	{ rank: '그랜드마스터4', points: 175_000, maxPlacement: 350 },
	{ rank: '그랜드마스터5', points: 150_000, maxPlacement: 500 },
	{ rank: '마스터1', points: 125_000, maxPlacement: 1000 },
	{ rank: '마스터2', points: 110_000, maxPlacement: 2000 },
	{ rank: '마스터3', points: 95_000, maxPlacement: 3000 },
	{ rank: '마스터4', points: 80_000, maxPlacement: 5000 },
	{ rank: '마스터5', points: 65_000, maxPlacement: null }
] as const satisfies readonly ExpeditionGuildTier[]

export function getExpeditionGuildTier(position: number): ExpeditionGuildTier | null {
	return EXPEDITION_GUILD_TIERS[position - 1] ?? null
}

/**
 * 등급명 → UI 구간.
 * 빈 값(`-`)·미매칭은 null.
 */
export function getExpeditionTierBand(grade: string): ExpeditionTierBand | null {
	if (!grade || grade === '-') {
		return null
	}

	if (grade.startsWith('챌린저')) {
		return 'challenger'
	}

	if (grade.startsWith('그랜드마스터')) {
		return 'grandmaster'
	}

	if (grade.startsWith('마스터')) {
		return 'master'
	}

	return null
}

/**
 * 토벌전 등급 텍스트 색·두께.
 * 빈 값은 grayscale-400, 미매칭은 빈 문자열(호출측 기본 스타일 유지).
 */
export function getExpeditionGradeTextClass(grade: string): string {
	if (!grade || grade === '-') {
		return 'text-grayscale-400'
	}

	const band = getExpeditionTierBand(grade)

	return band ? EXPEDITION_TIER_BAND_META[band].textClassName : ''
}

/**
 * 토벌전 등급명 → 순위(1=챌린저1 최상위, 15=마스터5 최하위).
 * 길드원 개인 등급·길드 순위 등급 모두 동일한 명칭 체계를 사용합니다.
 */
export function getExpeditionGradeRank(grade: string): number | null {
	const index = EXPEDITION_GUILD_TIERS.findIndex((tier) => tier.rank === grade)

	return index === -1 ? null : index + 1
}

/**
 * 직전 대비 등급 변화 단계.
 * 양수=상승(챌린저1 방향), 음수=하락(마스터5 방향), 0=동일.
 */
export function getExpeditionGradeDiff(previous: string, current: string): number | null {
	const previousRank = getExpeditionGradeRank(previous)
	const currentRank = getExpeditionGradeRank(current)

	if (previousRank === null || currentRank === null) {
		return null
	}

	return previousRank - currentRank
}

export function getExpeditionGradePoints(grade: string): number {
	return EXPEDITION_GUILD_TIERS.find((tier) => tier.rank === grade)?.points ?? 0
}

/**
 * 길드원 개인 토벌전 등급에 부여된 포인트를 모두 합산합니다.
 * (길드 내 점수 순위별 포인트와는 별개)
 */
export function sumExpeditionGradePoints(grades: readonly string[]): number {
	return grades.reduce((sum, grade) => sum + getExpeditionGradePoints(grade), 0)
}

type ExpeditionScoreEntry = {
	score: bigint
	name: string
}

/**
 * 토벌전 점수 순위에 따라 길드원별 등급 포인트를 합산합니다.
 * 동점일 때는 이름(가나다) 순으로 순위를 정합니다.
 */
export function calculateExpeditionGuildPoints(entries: ExpeditionScoreEntry[]): number {
	const sorted = [...entries].sort((left, right) => {
		if (left.score === right.score) {
			return left.name.localeCompare(right.name, 'ko')
		}

		return left.score > right.score ? -1 : 1
	})

	return sorted.reduce((sum, _entry, index) => {
		const tier = getExpeditionGuildTier(index + 1)

		return sum + (tier?.points ?? 0)
	}, 0)
}
