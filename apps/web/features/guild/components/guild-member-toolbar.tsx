'use client'

import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'

import ContentUpdatedAtGuide from '@/features/guild/components/content-updated-at-guide'
import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import GuildMemberFilters from '@/features/guild/components/guild-member-filters'
import JobDistributionGuide from '@/features/guild/components/job-distribution-guide'
import RivalryRankPointsGuide from '@/features/guild/components/rivalry-rank-points-guide'
import WeeklyGrowthLeaders from '@/features/guild/components/weekly-growth-leaders'
import type { GuildMemberFilterState } from '@/features/guild/lib/filter-guild-members'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'

type GuildMemberToolbarProps = {
	comparisons: GuildMemberComparison[]
	visibleCount: number
	isFilterActive: boolean
	sortByPercent: boolean
	onSortByPercentChange: (checked: boolean) => void
	filter: GuildMemberFilterState
	onFilterChange: (next: GuildMemberFilterState) => void
}

/**
 * 길드원 테이블 위 조작 바.
 * 인원 요약·증감율 정렬·필터와 참고용 가이드를 묶습니다. (테이블 본문과 역할이 다름)
 */
function GuildMemberToolbar({
	comparisons,
	visibleCount,
	isFilterActive,
	sortByPercent,
	onSortByPercentChange,
	filter,
	onFilterChange
}: GuildMemberToolbarProps) {
	const { length: totalCount } = comparisons

	return (
		<div className="flex w-full min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
			{/*
			  < lg: 1행=인원·증감율·필터 / 2행=가이드
			  lg+: 한 줄 — 좌=인원 / 우=조작·가이드 (lg:contents로 조작 행을 펼침)
			*/}
			<div className="flex items-center justify-between gap-2 lg:contents">
				{/* 필터 적용 시에만 인원 요약 표시 — lg:mr-auto로 조작·가이드를 오른쪽으로 밀어냄 */}
				<p className="text-grayscale-500 text-sm tabular-nums lg:mr-auto">
					{isFilterActive ? `${visibleCount} / ${totalCount}명` : `${totalCount}명`}
				</p>
				<div className="flex items-center gap-2 lg:gap-3">
					{/* OFF=절대값 정렬, ON=증감율(%) 정렬 — 필터 버튼과 같은 outline 톤으로 대비 */}
					<Label
						htmlFor="sort-by-percent"
						className="border-grayscale-200 bg-card gap-1.5 rounded-md border px-2.5 py-1.5 font-normal text-black shadow-xs"
					>
						<span className="text-sm">증감율</span>
						<Switch
							id="sort-by-percent"
							size="sm"
							checked={sortByPercent}
							onCheckedChange={onSortByPercentChange}
							aria-label="증감율 기준 정렬"
						/>
					</Label>
					<GuildMemberFilters comparisons={comparisons} filter={filter} onFilterChange={onFilterChange} />
				</div>
			</div>
			{/* min-w-0: flex 한 줄에서도 줄어들 수 있게. 좁으면 가로 스크롤 */}
			<div className="flex min-w-0 scrollbar-none items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
				<WeeklyGrowthLeaders comparisons={comparisons} />
				<ContentUpdatedAtGuide />
				<JobDistributionGuide comparisons={comparisons} />
				<ExpeditionTierGuide />
				<RivalryRankPointsGuide />
			</div>
		</div>
	)
}

export default GuildMemberToolbar
