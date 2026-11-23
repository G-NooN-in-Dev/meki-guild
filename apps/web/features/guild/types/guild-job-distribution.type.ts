import type { GuildMetricSeries } from '@/features/guild/types/guild-dashboard.type'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import type { JobClassLine } from '@/libs/job-class.constants'

/** 상세 직업군 Card 1장 */
type GuildJobClassLineCardData = {
	classLine: JobClassLine
	/** Card 배경 (직업군 고유 pastel) */
	backgroundClass: string
	/** 해당 직업군 내 직업별 인원 추이 */
	series: GuildMetricSeries[]
	/** 현재 주 해당 직업군 길드원 */
	members: GuildMemberComparison[]
}

export type { GuildJobClassLineCardData }
