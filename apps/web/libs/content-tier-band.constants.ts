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
 * 다크: 밴드 헤더는 파스텔을 한 단계 어둡게, 등급명은 카드 바탕 위 가독용으로 밝힌다.
 * 실버는 grayscale-50이 다크에서 검게 뒤집히므로 중회색 실버 톤을 따로 둔다.
 */
export const CONTENT_TIER_BAND_META = {
	champion: {
		label: '챔피언',
		headerClassName: 'bg-pastel-red-50 text-pastel-red-800 dark:bg-pastel-red-200 dark:text-pastel-red-900',
		textClassName: 'font-semibold text-pastel-red-800 dark:text-pastel-red-300'
	},
	challenger: {
		label: '챌린저',
		headerClassName: 'bg-pastel-navy-50 text-pastel-navy-800 dark:bg-pastel-navy-200 dark:text-pastel-navy-900',
		textClassName: 'font-semibold text-pastel-navy-800 dark:text-pastel-navy-300'
	},
	grandmaster: {
		label: '그랜드마스터',
		headerClassName: 'bg-pastel-green-50 text-pastel-green-800 dark:bg-pastel-green-200 dark:text-pastel-green-900',
		textClassName: 'font-semibold text-pastel-green-800 dark:text-pastel-green-300'
	},
	master: {
		label: '마스터',
		headerClassName:
			'bg-pastel-orange-100 text-pastel-orange-700 dark:bg-pastel-orange-200 dark:text-pastel-orange-900',
		textClassName: 'font-semibold text-pastel-orange-700 dark:text-pastel-orange-300'
	},
	diamond: {
		label: '다이아몬드',
		headerClassName: 'bg-pastel-purple-50 text-pastel-purple-800 dark:bg-pastel-purple-200 dark:text-pastel-purple-900',
		textClassName: 'font-semibold text-pastel-purple-800 dark:text-pastel-purple-300'
	},
	platinum: {
		label: '플래티넘',
		headerClassName: 'bg-pastel-blue-100 text-pastel-blue-800 dark:bg-pastel-blue-200 dark:text-pastel-blue-900',
		textClassName: 'font-semibold text-pastel-blue-800 dark:text-pastel-blue-300'
	},
	gold: {
		label: '골드',
		headerClassName: 'bg-pastel-yellow-50 text-pastel-yellow-800 dark:bg-pastel-yellow-200 dark:text-pastel-yellow-900',
		textClassName: 'font-semibold text-pastel-yellow-800 dark:text-pastel-yellow-300'
	},
	silver: {
		label: '실버',
		headerClassName: 'bg-grayscale-100 text-grayscale-600 dark:bg-grayscale-300 dark:text-grayscale-800',
		textClassName: 'font-semibold text-grayscale-600 dark:text-grayscale-700'
	},
	bronze: {
		label: '브론즈',
		headerClassName: 'bg-pastel-orange-50 text-pastel-orange-800 dark:bg-pastel-orange-200 dark:text-pastel-orange-900',
		textClassName: 'font-semibold text-pastel-orange-800 dark:text-pastel-orange-300'
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
