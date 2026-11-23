'use client'

import { Card, CardContent } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { Label } from '@shared/ui/label'
import { Separator } from '@shared/ui/separator'
import { Switch } from '@shared/ui/switch'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import GuildDetailMemberCharts from '@/features/guild/components/guild-detail-member-charts'
import GuildDetailMemberSummary from '@/features/guild/components/guild-detail-member-summary'
import { getDetailSectionSortKey } from '@/features/guild/lib/detail-section-sort'
import { type GuildMemberSortDirection, sortGuildMembers } from '@/features/guild/lib/sort-guild-members'
import type { GuildRosterSectionId } from '@/features/guild/types/guild-dashboard.type'
import type { GuildDetailRosterData } from '@/features/guild/types/guild-detail-roster.type'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'

type GuildDetailRosterProps = {
	sectionId: GuildRosterSectionId
	roster: GuildDetailRosterData
}

/**
 * 전체 길드원 로스터.
 * 공통: 증감율 스위치 · 정렬 버튼
 * lg+: 1/3 리스트 + 2/3 차트 / 그 미만: Collapsible
 */
function GuildDetailRoster({ sectionId, roster }: GuildDetailRosterProps) {
	const sortKey = getDetailSectionSortKey(sectionId)
	const [sortByPercent, setSortByPercent] = useState(false)
	const [sortDirection, setSortDirection] = useState<GuildMemberSortDirection>('desc')
	const [selectedName, setSelectedName] = useState<string | null>(null)

	const sortedComparisons = sortGuildMembers(roster.comparisons, {
		sortKey,
		sortDirection,
		sortByPercent
	})

	// 정렬 후에도 선택이 목록에 있으면 유지, 없으면 첫 멤버
	const effectiveSelectedName =
		selectedName && sortedComparisons.some((comparison) => comparison.name === selectedName)
			? selectedName
			: (sortedComparisons[0]?.name ?? null)

	const selectedCharts = effectiveSelectedName
		? (roster.chartsByMember[effectiveSelectedName]?.[sectionId] ?? null)
		: null

	function handleToggleSortDirection() {
		setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
	}

	return (
		<div className="flex min-w-0 flex-col gap-3">
			{/* 공통 툴바 */}
			<div className="flex flex-wrap items-center justify-end gap-2">
				<Label
					htmlFor={`detail-sort-by-percent-${sectionId}`}
					className="border-grayscale-200 bg-card gap-1.5 rounded-md border px-2.5 py-1.5 font-normal whitespace-nowrap text-black shadow-xs"
				>
					<span className="text-sm">증감율</span>
					<Switch
						id={`detail-sort-by-percent-${sectionId}`}
						size="sm"
						checked={sortByPercent}
						onCheckedChange={setSortByPercent}
						aria-label="증감율 기준 정렬"
					/>
				</Label>
				<button
					type="button"
					onClick={handleToggleSortDirection}
					className="border-grayscale-200 bg-card text-grayscale-800 hover:bg-grayscale-50 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm shadow-xs"
					aria-label={
						sortDirection === 'desc' ? '높은 순 정렬 중, 낮은 순으로 전환' : '낮은 순 정렬 중, 높은 순으로 전환'
					}
				>
					{sortDirection === 'desc' ? '높은 순' : '낮은 순'}
					<span className="text-[10px]" aria-hidden>
						{sortDirection === 'desc' ? '▼' : '▲'}
					</span>
				</button>
			</div>

			{/* 모바일·태블릿: Collapsible 목록 */}
			<ul className="flex min-w-0 flex-col gap-2 lg:hidden">
				{sortedComparisons.map((comparison) => (
					<li key={comparison.name}>
						<MobileMemberCollapsible
							comparison={comparison}
							sectionId={sectionId}
							sortByPercent={sortByPercent}
							roster={roster}
						/>
					</li>
				))}
			</ul>

			{/* 데스크탑: 1/3 리스트 + 2/3 차트.
			    h-0 min-h-full — 행 높이는 오른쪽 차트만 정하고, 왼쪽은 그 높이에 맞춰 스크롤 */}
			<div className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-3">
				<Card size="sm" className="h-0 min-h-full min-w-0 py-0 lg:col-span-1">
					<CardContent className="flex h-full min-h-0 flex-col p-0">
						<ul className="min-h-0 flex-1 overflow-y-auto p-2">
							{sortedComparisons.map((comparison, index) => {
								const isSelected = comparison.name === effectiveSelectedName

								return (
									<li key={comparison.name}>
										{index > 0 ? <Separator className="bg-grayscale-100 my-1" /> : null}
										<button
											type="button"
											onClick={() => setSelectedName(comparison.name)}
											className={cn(
												'w-full rounded-lg border border-transparent p-2 text-left transition-colors',
												'hover:bg-grayscale-50',
												isSelected && 'border-grayscale-300 bg-grayscale-50'
											)}
											aria-pressed={isSelected}
										>
											<GuildDetailMemberSummary
												comparison={comparison}
												sectionId={sectionId}
												sortByPercent={sortByPercent}
											/>
										</button>
									</li>
								)
							})}
						</ul>
					</CardContent>
				</Card>

				<Card size="sm" className="min-w-0 lg:col-span-2">
					<CardContent className="pt-4">
						{selectedCharts ? (
							<GuildDetailMemberCharts charts={selectedCharts} />
						) : (
							<p className="text-grayscale-500 py-8 text-center text-sm">길드원을 선택하세요</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

type MobileMemberCollapsibleProps = {
	comparison: GuildMemberComparison
	sectionId: GuildRosterSectionId
	sortByPercent: boolean
	roster: GuildDetailRosterData
}

function MobileMemberCollapsible({ comparison, sectionId, sortByPercent, roster }: MobileMemberCollapsibleProps) {
	const charts = roster.chartsByMember[comparison.name]?.[sectionId]

	return (
		<Collapsible className="border-grayscale-200 bg-card overflow-hidden rounded-xl border shadow-xs">
			<CollapsibleTrigger className="group hover:bg-grayscale-50 flex w-full cursor-pointer items-center gap-2 p-3 text-left">
				<div className="min-w-0 flex-1">
					<GuildDetailMemberSummary comparison={comparison} sectionId={sectionId} sortByPercent={sortByPercent} />
				</div>
				<ChevronDownIcon
					aria-hidden
					className="text-grayscale-400 size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
				/>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="border-grayscale-100 border-t px-3 py-3">
					{charts ? (
						<GuildDetailMemberCharts charts={charts} />
					) : (
						<p className="text-grayscale-500 text-sm">데이터 없음</p>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}

export default GuildDetailRoster
