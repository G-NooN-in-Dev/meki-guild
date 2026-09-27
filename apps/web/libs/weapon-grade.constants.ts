/**
 * 무기 등급 기준표.
 * 상위 밴드(에인션트→노말) × 세부(최상급→하급).
 */

import {
	getBandByPrefix,
	getGradeDiffFromRanks,
	getGradeRankFromList,
	getGradeTextClassFromBand,
	type GradeBandMeta
} from '@/libs/grade-tier.helpers'

const WEAPON_GRADE_BANDS = ['에인션트', '미스틱', '레전드리', '유니크', '에픽', '레어', '노말'] as const

/** 세부 등급. 최상급을 상급보다 먼저 둬야 파싱 시 부분 일치가 꼬이지 않습니다. */
const WEAPON_GRADE_LEVELS = ['최상급', '상급', '중급', '하급'] as const

type WeaponGradeBand = (typeof WEAPON_GRADE_BANDS)[number]

/** 정규 표기: `에인션트 최상급` … `노말 하급` (상위부터) */
const WEAPON_GRADES = WEAPON_GRADE_BANDS.flatMap((band) =>
	WEAPON_GRADE_LEVELS.map((level) => `${band} ${level}`)
) as readonly string[]

const WEAPON_GRADE_BAND_PREFIXES = WEAPON_GRADE_BANDS.map((band) => ({ prefix: band, band }))

/**
 * 밴드별 UI 톤.
 * 헤더·등급명 텍스트색에 사용합니다.
 */
const WEAPON_GRADE_BAND_META = {
	에인션트: {
		label: '에인션트',
		headerClassName: 'bg-pastel-navy-50 text-pastel-navy-800',
		textClassName: 'font-semibold text-pastel-navy-800'
	},
	미스틱: {
		label: '미스틱',
		headerClassName: 'bg-pastel-red-50 text-pastel-red-800',
		textClassName: 'font-semibold text-pastel-red-800'
	},
	레전드리: {
		label: '레전드리',
		headerClassName: 'bg-pastel-green-50 text-pastel-green-800',
		textClassName: 'font-semibold text-pastel-green-800'
	},
	유니크: {
		label: '유니크',
		headerClassName: 'bg-pastel-yellow-50 text-pastel-yellow-800',
		textClassName: 'font-semibold text-pastel-yellow-800'
	},
	에픽: {
		label: '에픽',
		headerClassName: 'bg-pastel-purple-100 text-pastel-purple-700',
		textClassName: 'font-semibold text-pastel-purple-700'
	},
	레어: {
		label: '레어',
		headerClassName: 'bg-pastel-blue-50 text-pastel-blue-800',
		textClassName: 'font-semibold text-pastel-blue-800'
	},
	노말: {
		label: '노말',
		headerClassName: 'bg-grayscale-100 text-grayscale-600',
		textClassName: 'font-semibold text-grayscale-600'
	}
} as const satisfies Record<WeaponGradeBand, GradeBandMeta>

/** 공백·구분자 제거 후 비교용 키 */
function toWeaponGradeKey(value: string): string {
	return value
		.replace(/레전더리/g, '레전드리')
		.replace(/[\s/·・\-_|]+/g, '')
		.trim()
}

/**
 * mgf 무기 라벨 → 정규 등급명.
 * `에인션트 최상급`, `에인션트/최상급`, `에인션트최상급` 등 허용.
 */
function parseWeaponGrade(raw: string | null | undefined): string | null {
	if (!raw) {
		return null
	}

	const trimmed = raw.replace(/\s+/g, ' ').trim()
	if (!trimmed || trimmed === '-') {
		return null
	}

	const compact = toWeaponGradeKey(trimmed)

	for (const grade of WEAPON_GRADES) {
		if (toWeaponGradeKey(grade) === compact) {
			return grade
		}
	}

	// 밴드·세부만 포함돼 있어도 매칭 (순서 무관)
	for (const band of WEAPON_GRADE_BANDS) {
		if (!compact.includes(band)) {
			continue
		}

		for (const level of WEAPON_GRADE_LEVELS) {
			if (compact.includes(level)) {
				return `${band} ${level}`
			}
		}
	}

	return null
}

/** 등급명 → 밴드. 빈 값·미매칭은 null */
function getWeaponGradeBand(grade: string): WeaponGradeBand | null {
	return getBandByPrefix(grade, WEAPON_GRADE_BAND_PREFIXES)
}

/** 무기 등급 텍스트 색·두께 */
function getWeaponGradeTextClass(grade: string): string {
	return getGradeTextClassFromBand(grade, getWeaponGradeBand, WEAPON_GRADE_BAND_META)
}

/** 등급명 → 순위(1=에인션트 최상급 … N=노말 하급) */
function getWeaponGradeRank(grade: string): number | null {
	const canonical = parseWeaponGrade(grade) ?? grade

	return getGradeRankFromList(WEAPON_GRADES, canonical)
}

/**
 * 등급 변화 단계.
 * 양수=상승(에인션트 최상급 방향), 음수=하락, 0=동일.
 */
function getWeaponGradeDiff(previous: string, current: string): number | null {
	return getGradeDiffFromRanks(getWeaponGradeRank, previous, current)
}

export { getWeaponGradeDiff, getWeaponGradeTextClass, parseWeaponGrade }
