import { Card, CardContent } from '@shared/ui/card'

import GuildDetailRoster from '@/features/guild-v2/components/guild-detail-roster'
import GuildJobDistributionPanel from '@/features/guild-v2/components/guild-job-distribution-panel'
import GuildMetricChart from '@/features/guild-v2/components/guild-metric-chart'
import type { GuildDetailRosterData } from '@/features/guild-v2/types/guild-detail-roster.type'
import type { GuildJobClassLineCardData } from '@/features/guild-v2/types/guild-job-distribution.type'
import type {
	GuildDashboardChartCard,
	GuildDashboardChartCardId
} from '@/features/guild-v2/types/guild-v2-dashboard.type'

type GuildDetailV2SectionProps = {
	/** path `/detail/[section]` 에서 읽은 선택 항목 */
	selectedSection: GuildDashboardChartCardId
	/** 대시보드와 동일한 차트 카드 목록 */
	cards: GuildDashboardChartCard[]
	/** 전체 길드원 로스터·멤버별 3주 차트 */
	roster: GuildDetailRosterData
	/** 직업 탭 전용: 직업군 Card */
	jobClassLineCards: GuildJobClassLineCardData[]
}

/**
 * 길드 정보 v2 상세 본문.
 * Marquee·탭은 layout 셸에 두고, 여기선 선택 항목 영역만 바꿉니다.
 */
function GuildDetailV2Section({ selectedSection, cards, roster, jobClassLineCards }: GuildDetailV2SectionProps) {
	const selectedCard = cards.find((card) => card.id === selectedSection)
	const isJobsSection = selectedSection === 'jobs'

	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			{isJobsSection && selectedCard ? (
				<GuildJobDistributionPanel classLineSeries={selectedCard.series} classLineCards={jobClassLineCards} />
			) : null}

			{!isJobsSection && selectedCard ? (
				<Card size="sm" className="min-w-0">
					<CardContent className="pt-4">
						<GuildMetricChart seriesList={selectedCard.series} />
					</CardContent>
				</Card>
			) : null}

			{/* 전체 길드원 — 정렬·증감율 + 반응형 리스트/차트. key로 항목 전환 시 정렬·선택 초기화 */}
			{!isJobsSection ? <GuildDetailRoster key={selectedSection} sectionId={selectedSection} roster={roster} /> : null}
		</div>
	)
}

export default GuildDetailV2Section
