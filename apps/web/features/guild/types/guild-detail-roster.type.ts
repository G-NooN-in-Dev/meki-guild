import type { GuildMetricSeries, GuildRosterSectionId } from '@/features/guild/types/guild-dashboard.type'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'

/** 선택한 항목·멤버의 상세 차트 묶음 */
type GuildDetailMemberSectionCharts = {
	/** 길드 내 순위 변동 (3주) */
	rankSeries: GuildMetricSeries[]
	/** 항목 지표 변동 (3주). 등급처럼 표기만인 시리즈는 showInChart=false */
	metricSeries: GuildMetricSeries[]
}

/** 멤버 이름 → 항목별 차트 (직업 분포 jobs 제외) */
type GuildDetailChartsByMember = Record<string, Record<GuildRosterSectionId, GuildDetailMemberSectionCharts>>

type GuildDetailRosterData = {
	/** 현재 로스터 (이탈 제외). 정렬·카드에 사용 */
	comparisons: GuildMemberComparison[]
	chartsByMember: GuildDetailChartsByMember
}

export type { GuildDetailChartsByMember, GuildDetailMemberSectionCharts, GuildDetailRosterData }
