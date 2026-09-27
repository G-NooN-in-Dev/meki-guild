/**
 * 토벌전·월드보스 공통 등급 구간(밴드) UI.
 * 등급명 접두사로 매칭합니다.
 */

import { getBandByPrefix, getGradeTextClassFromBand, type GradeBandMeta } from '@/libs/grade-tier.helpers'

type ContentTierBand =
	'champion' | 'challenger' | 'grandmaster' | 'master' | 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'

/** 긴 접두사(그랜드마스터)를 마스터보다 먼저 둡니다. */
const CONTENT_TIER_BAND_PREFIXES = [
	{ prefix: '챔피언', band: 'champion' },
	{ prefix: '챌린저', band: 'challenger' },
	{ prefix: '그랜드마스터', band: 'grandmaster' },
	{ prefix: '마스터', band: 'master' },
	{ prefix: '다이아몬드', band: 'diamond' },
	{ prefix: '플래티넘', band: 'platinum' },
	{ prefix: '골드', band: 'gold' },
	{ prefix: '실버', band: 'silver' },
	{ prefix: '브론즈', band: 'bronze' }
] as const satisfies readonly { prefix: string; band: ContentTierBand }[]

/**
 * 구간별 UI 톤.
 * 헤더는 배경+라벨색, 등급명은 텍스트색 + 한 단계 올린 두께를 씁니다.
 */
export const CONTENT_TIER_BAND_META = {
	champion: {
		label: '챔피언',
		headerClassName: 'bg-pastel-red-50 text-pastel-red-800',
		textClassName: 'font-semibold text-pastel-red-800'
	},
	challenger: {
		label: '챌린저',
		headerClassName: 'bg-pastel-navy-50 text-pastel-navy-800',
		textClassName: 'font-semibold text-pastel-navy-800'
	},
	grandmaster: {
		label: '그랜드마스터',
		headerClassName: 'bg-pastel-green-50 text-pastel-green-800',
		textClassName: 'font-semibold text-pastel-green-800'
	},
	master: {
		label: '마스터',
		headerClassName: 'bg-pastel-orange-100 text-pastel-orange-700',
		textClassName: 'font-semibold text-pastel-orange-700'
	},
	diamond: {
		label: '다이아몬드',
		headerClassName: 'bg-pastel-purple-50 text-pastel-purple-800',
		textClassName: 'font-semibold text-pastel-purple-800'
	},
	platinum: {
		label: '플래티넘',
		headerClassName: 'bg-pastel-blue-100 text-pastel-blue-800',
		textClassName: 'font-semibold text-pastel-blue-800'
	},
	gold: {
		label: '골드',
		headerClassName: 'bg-pastel-yellow-50 text-pastel-yellow-800',
		textClassName: 'font-semibold text-pastel-yellow-800'
	},
	silver: {
		label: '실버',
		headerClassName: 'bg-grayscale-50 text-grayscale-600',
		textClassName: 'font-semibold text-grayscale-600'
	},
	bronze: {
		label: '브론즈',
		headerClassName: 'bg-pastel-orange-50 text-pastel-orange-800',
		textClassName: 'font-semibold text-pastel-orange-800'
	}
} as const satisfies Record<ContentTierBand, GradeBandMeta>

/** 등급명 → UI 구간. 빈 값·미매칭은 null */
function getContentTierBand(grade: string): ContentTierBand | null {
	return getBandByPrefix(grade, CONTENT_TIER_BAND_PREFIXES)
}

/** 토벌전·월드보스 등급 텍스트 색·두께 */
function getContentGradeTextClass(grade: string): string {
	return getGradeTextClassFromBand(grade, getContentTierBand, CONTENT_TIER_BAND_META)
}

export { getContentGradeTextClass, getContentTierBand }
export type { ContentTierBand }
