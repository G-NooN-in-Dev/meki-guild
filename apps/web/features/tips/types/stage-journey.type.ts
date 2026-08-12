import type { GameItemId } from '@/libs/game-item.constants'

/** 용사의 발자취 보유 효과 등급 (미스틱 / 미스틱+ 구분) */
type StageJourneyGrade = 'normal' | 'rare' | 'epic' | 'unique' | 'legendary' | 'mystic' | 'mysticPlus'

type StageJourneyStatUnit = 'flat' | 'percent'

/** 클리어 시 받는 기본 보상 한 줄 */
type StageJourneyReward = {
	itemId: GameItemId
	amount: number
}

/** 보유 효과 슬롯 1개 (등급별 수치) */
type StageJourneyEffectSlot = {
	label: string
	unit: StageJourneyStatUnit
	values: Record<StageJourneyGrade, number>
	isEstimated?: boolean
}

/** 3슬롯 모두 유니크 이상일 때 열리는 특수 옵션 */
type StageJourneySpecialOption = {
	label: string
	value: number
	unit: 'percent'
}

/** 챕터 1개 분량의 보상·보유 효과·특수 옵션 */
type StageJourneyChapter = {
	chapter: number
	name: string
	rewards?: readonly StageJourneyReward[]
	slots?: readonly StageJourneyEffectSlot[]
	special?: StageJourneySpecialOption
}

export type {
	StageJourneyChapter,
	StageJourneyEffectSlot,
	StageJourneyGrade,
	StageJourneyReward,
	StageJourneySpecialOption,
	StageJourneyStatUnit
}
