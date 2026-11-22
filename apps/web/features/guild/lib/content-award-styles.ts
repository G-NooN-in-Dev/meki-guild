import type { ContentAwardMetricKey } from '@/features/guild/lib/select-content-award-winners'

/** 부문별 배경색 — pastel-50으로 슬롯을 구분 */
const AWARD_SLOT_BG_CLASS_NAME = {
	combatPower: 'bg-pastel-orange-50',
	expeditionScore: 'bg-pastel-green-50',
	rivalry: 'bg-pastel-navy-50',
	bounty: 'bg-pastel-red-50',
	guildBoss: 'bg-pastel-purple-50',
	training: 'bg-pastel-blue-50'
} as const satisfies Record<ContentAwardMetricKey, string>

export { AWARD_SLOT_BG_CLASS_NAME }
