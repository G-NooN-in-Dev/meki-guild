import { STAGE_JOURNEY_CHAPTERS } from '@/features/tips/lib/stage-journey-chapters.data'
import type { StageJourneyGrade } from '@/features/tips/types/stage-journey.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 등급 표시 순서 (낮은 등급 → 높은 등급) */
const STAGE_JOURNEY_GRADE_ORDER = [
	'normal',
	'rare',
	'epic',
	'unique',
	'legendary',
	'mystic',
	'mysticPlus'
] as const satisfies readonly StageJourneyGrade[]

/** 등급 표시 라벨·Badge 색·확률 */
const STAGE_JOURNEY_GRADE_META = {
	normal: {
		label: '노말',
		probabilityText: '40%',
		badgeClassName: 'border-transparent bg-grayscale-100 text-grayscale-700'
	},
	rare: {
		label: '레어',
		probabilityText: '30%',
		badgeClassName: 'border-transparent bg-pastel-blue-100 text-pastel-blue-800'
	},
	epic: {
		label: '에픽',
		probabilityText: '22%',
		badgeClassName: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800'
	},
	unique: {
		label: '유니크',
		probabilityText: '4%',
		badgeClassName: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800'
	},
	legendary: {
		label: '레전드리',
		probabilityText: '2.5%',
		badgeClassName: 'border-transparent bg-pastel-green-100 text-pastel-green-800'
	},
	mystic: {
		label: '미스틱',
		probabilityText: '1.3%',
		badgeClassName: 'border-transparent bg-pure-red/15 text-danger-700'
	},
	mysticPlus: {
		label: '미스틱+',
		probabilityText: '0.2%',
		badgeClassName: 'border-transparent bg-pure-red/15 text-danger-700'
	}
} as const satisfies Record<StageJourneyGrade, { label: string; probabilityText: string; badgeClassName: string }>

/** 보스 초상화 public 경로 (기본값) */
function getStageJourneyPortraitSrc(chapter: number) {
	return `/tips/stage-boss/stage-boss-${chapter}.gif`
}

/**
 * 용사의 발자취 챕터 목록 (20~47).
 * 클리어 보상·보유 효과 3슬롯·특수 옵션을 챕터별로 둡니다.
 * 42~47은 공격력·최대 HP 추정값만 두고, 3번째 슬롯·보상·특수 옵션은 미확정입니다.
 */
const STAGE_JOURNEY_DEFAULT_CHAPTER = STAGE_JOURNEY_CHAPTERS[0]?.chapter ?? 20

function getStageJourneyChapter(chapter: number) {
	return STAGE_JOURNEY_CHAPTERS.find((entry) => entry.chapter === chapter)
}

/** 보유 효과·특수 옵션 수치 표시 */
function formatStageJourneyStatValue(value: number, unit: 'flat' | 'percent') {
	if (unit === 'percent') {
		return `${value}%`
	}
	return formatLocaleNumber(value)
}

export {
	formatStageJourneyStatValue,
	getStageJourneyChapter,
	getStageJourneyPortraitSrc,
	STAGE_JOURNEY_CHAPTERS,
	STAGE_JOURNEY_DEFAULT_CHAPTER,
	STAGE_JOURNEY_GRADE_META,
	STAGE_JOURNEY_GRADE_ORDER
}
