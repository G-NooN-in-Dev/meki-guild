/**
 * 무기 등급 기준표.
 * 상위 밴드(eternity→normal) × 세부(최상급→하급).
 * 키는 영문이고, 화면 표기는 label입니다.
 */

import { GRADE_LABEL } from '@/libs/grade.constants'
import type { GradeBandMeta } from '@/libs/grade-tier.helpers'

const WEAPON_GRADE_BANDS = ['eternity', 'ancient', 'mystic', 'legendary', 'unique', 'epic', 'rare', 'normal'] as const

/** 세부 등급. 높은 등급부터입니다. */
const WEAPON_GRADE_LEVELS = ['최상급', '상급', '중급', '하급'] as const

type WeaponGradeBand = (typeof WEAPON_GRADE_BANDS)[number]

/**
 * 밴드별 UI 톤.
 * 헤더·등급명 텍스트색에 사용합니다.
 * 다크: 밴드 헤더는 파스텔을 한 단계 어둡게, 등급명은 카드 바탕 위 가독용으로 밝힌다.
 */
const WEAPON_GRADE_BAND_META = {
	eternity: {
		label: GRADE_LABEL.eternity,
		headerClassName:
			'bg-pastel-magenta-50 text-pastel-magenta-800 dark:bg-pastel-magenta-200 dark:text-pastel-magenta-900',
		textClassName: 'font-semibold text-pastel-magenta-800 dark:text-pastel-magenta-300'
	},
	ancient: {
		label: GRADE_LABEL.ancient,
		headerClassName: 'bg-pastel-navy-50 text-pastel-navy-800 dark:bg-pastel-navy-200 dark:text-pastel-navy-900',
		textClassName: 'font-semibold text-pastel-navy-800 dark:text-pastel-navy-300'
	},
	mystic: {
		label: GRADE_LABEL.mystic,
		headerClassName: 'bg-pastel-red-50 text-pastel-red-800 dark:bg-pastel-red-200 dark:text-pastel-red-900',
		textClassName: 'font-semibold text-pastel-red-800 dark:text-pastel-red-300'
	},
	legendary: {
		label: GRADE_LABEL.legendary,
		headerClassName: 'bg-pastel-green-50 text-pastel-green-800 dark:bg-pastel-green-200 dark:text-pastel-green-900',
		textClassName: 'font-semibold text-pastel-green-800 dark:text-pastel-green-300'
	},
	unique: {
		label: GRADE_LABEL.unique,
		headerClassName: 'bg-pastel-yellow-50 text-pastel-yellow-800 dark:bg-pastel-yellow-200 dark:text-pastel-yellow-900',
		textClassName: 'font-semibold text-pastel-yellow-800 dark:text-pastel-yellow-300'
	},
	epic: {
		label: GRADE_LABEL.epic,
		headerClassName:
			'bg-pastel-purple-100 text-pastel-purple-700 dark:bg-pastel-purple-200 dark:text-pastel-purple-900',
		textClassName: 'font-semibold text-pastel-purple-700 dark:text-pastel-purple-300'
	},
	rare: {
		label: GRADE_LABEL.rare,
		headerClassName: 'bg-pastel-blue-50 text-pastel-blue-800 dark:bg-pastel-blue-200 dark:text-pastel-blue-900',
		textClassName: 'font-semibold text-pastel-blue-800 dark:text-pastel-blue-300'
	},
	normal: {
		label: GRADE_LABEL.normal,
		headerClassName: 'bg-grayscale-100 text-grayscale-600 dark:bg-grayscale-300 dark:text-grayscale-800',
		textClassName: 'font-semibold text-grayscale-600 dark:text-grayscale-700'
	}
} as const satisfies Record<WeaponGradeBand, GradeBandMeta>

export { WEAPON_GRADE_BAND_META, WEAPON_GRADE_BANDS, WEAPON_GRADE_LEVELS }
export type { WeaponGradeBand }
