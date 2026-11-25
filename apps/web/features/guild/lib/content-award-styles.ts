import type { ContentAwardMetricKey } from '@/features/guild/lib/select-content-award-winners'

/** 부문별 배경색 */
const AWARD_SLOT_BG_CLASS_NAME = {
	combatPower: 'bg-pastel-orange-50 dark:bg-pastel-orange-900',
	expeditionScore: 'bg-pastel-green-50 dark:bg-pastel-green-900',
	rivalry: 'bg-pastel-navy-50 dark:bg-pastel-navy-900',
	bounty: 'bg-pastel-red-50 dark:bg-pastel-red-900',
	guildBoss: 'bg-pastel-purple-50 dark:bg-pastel-purple-900',
	training: 'bg-pastel-blue-50 dark:bg-pastel-blue-900'
} as const satisfies Record<ContentAwardMetricKey, string>

export { AWARD_SLOT_BG_CLASS_NAME }
