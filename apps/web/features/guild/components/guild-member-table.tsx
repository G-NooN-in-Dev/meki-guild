'use client'

import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shared/ui/tooltip'
import { useMemo, useState } from 'react'

import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import { GrowthDelta, MemberStatusBadge } from '@/features/guild/components/growth-delta'
import GuildMemberFilters from '@/features/guild/components/guild-member-filters'
import JobBadge from '@/features/guild/components/job-badge'
import JobDistributionGuide from '@/features/guild/components/job-distribution-guide'
import MemberDetailDialog from '@/features/guild/components/member-detail-dialog'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_EMPTY_VALUE_LABEL } from '@/features/guild/types/guild-snapshot.type'
import {
	getGuildContentUpdatedAtLines,
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDateRange
} from '@/libs/guild-content-dates.constants'
import {
	createEmptyGuildMemberFilter,
	filterGuildMembers,
	type GuildMemberFilterState,
	isGuildMemberFilterActive
} from '@/utils/filter-guild-members'

type SortKey = 'combatPower' | 'expeditionScore' | 'rivalry' | 'training' | 'guildBoss' | 'level'
type SortDirection = 'asc' | 'desc'

type GuildMemberTableProps = {
	comparisons: GuildMemberComparison[]
}

function getSortValue(comparison: GuildMemberComparison, key: SortKey): bigint | number {
	switch (key) {
		case 'combatPower':
			return comparison.combatPower.hasValue ? comparison.combatPower.current : -1n
		case 'expeditionScore':
			return comparison.expeditionScore.hasValue ? comparison.expeditionScore.current : -1n
		case 'rivalry':
			return comparison.rivalry.hasValue ? comparison.rivalry.current : -1n
		case 'training':
			return comparison.training.hasValue ? comparison.training.current : -1n
		case 'guildBoss':
			return comparison.guildBoss.hasValue ? comparison.guildBoss.current : -1n
		case 'level':
			return comparison.level.hasValue ? comparison.level.current : -1
	}
}

type SortHandler = (sortKey: SortKey) => void

function getValueClassName(label: string): string {
	return label === GUILD_EMPTY_VALUE_LABEL ? 'text-grayscale-400' : ''
}

/** 최근·직전 수집일을 Tooltip 본문으로 표시합니다 (데스크탑 hover 전용) */
function ContentDateTooltipBody({ contentDates }: { contentDates: GuildContentDateRange }) {
	const lines = getGuildContentUpdatedAtLines(contentDates)

	return (
		<div className="flex flex-col gap-0.5">
			<p>{lines.current}</p>
			<p>{lines.previous}</p>
		</div>
	)
}

type SortableHeadProps = {
	label: string
	sortKey: SortKey
	activeSortKey: SortKey
	sortDirection: SortDirection
	onSort: SortHandler
	/** 컨텐츠별 최근·직전 수집일. 있으면 헤더에 수집일 툴팁 표시 */
	contentDates?: GuildContentDateRange
}

type ContentDateHeadProps = {
	label: string
	contentDates: GuildContentDateRange
}

function ContentDateHead({ label, contentDates }: ContentDateHeadProps) {
	return (
		<TableHead className="text-grayscale-500">
			<Tooltip>
				<TooltipTrigger
					render={
						<span className="inline-flex cursor-pointer items-center gap-1 underline decoration-dotted underline-offset-4">
							{label}
						</span>
					}
				/>
				<TooltipContent>
					<ContentDateTooltipBody contentDates={contentDates} />
				</TooltipContent>
			</Tooltip>
		</TableHead>
	)
}

function SortableHead({ label, sortKey, activeSortKey, sortDirection, onSort, contentDates }: SortableHeadProps) {
	const isActive = activeSortKey === sortKey
	const hasContentDate = contentDates !== undefined

	return (
		<TableHead>
			{/* 라벨 클릭=정렬, hover=수집일 — Tooltip은 클릭과 충돌하지 않음 */}
			<Tooltip>
				<TooltipTrigger
					render={
						<button
							type="button"
							onClick={() => onSort(sortKey)}
							className={cn(
								'hover:text-grayscale-900 inline-flex cursor-pointer items-center gap-1 transition-colors',
								isActive ? 'text-grayscale-900' : 'text-grayscale-500',
								hasContentDate && 'underline decoration-dotted underline-offset-4'
							)}
						>
							{label}
							<span className="text-[10px]">{isActive ? (sortDirection === 'desc' ? '▼' : '▲') : '↕'}</span>
						</button>
					}
				/>
				{hasContentDate ? (
					<TooltipContent>
						<ContentDateTooltipBody contentDates={contentDates} />
					</TooltipContent>
				) : null}
			</Tooltip>
		</TableHead>
	)
}

function GuildMemberTable({ comparisons }: GuildMemberTableProps) {
	const [sortKey, setSortKey] = useState<SortKey>('combatPower')
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
	const [filter, setFilter] = useState<GuildMemberFilterState>(createEmptyGuildMemberFilter)

	// 필터 → 정렬 순으로 적용해, 좁혀진 목록만 테이블에 표시
	const filteredComparisons = useMemo(() => filterGuildMembers(comparisons, filter), [comparisons, filter])

	const sortedComparisons = useMemo(() => {
		const next = [...filteredComparisons]

		next.sort((left, right) => {
			if (left.status === 'left' && right.status !== 'left') {
				return 1
			}

			if (left.status !== 'left' && right.status === 'left') {
				return -1
			}

			const leftValue = getSortValue(left, sortKey)
			const rightValue = getSortValue(right, sortKey)

			if (leftValue === rightValue) {
				return left.name.localeCompare(right.name, 'ko')
			}

			const isAscending = sortDirection === 'asc'

			if (typeof leftValue === 'bigint' && typeof rightValue === 'bigint') {
				if (leftValue === rightValue) {
					return 0
				}

				return isAscending ? (leftValue < rightValue ? -1 : 1) : leftValue > rightValue ? -1 : 1
			}

			return isAscending
				? (leftValue as number) - (rightValue as number)
				: (rightValue as number) - (leftValue as number)
		})

		return next
	}, [filteredComparisons, sortDirection, sortKey])

	const isFilterActive = isGuildMemberFilterActive(filter)

	function handleSort(nextKey: SortKey) {
		if (sortKey === nextKey) {
			setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
			return
		}

		setSortKey(nextKey)
		setSortDirection('desc')
	}

	return (
		<TooltipProvider>
			<div className="flex w-full min-w-0 flex-col gap-3">
				{/*
				  모바일: 1행 우측=가이드 / 2행 좌=인원·우=필터
				  데스크탑: 좌=인원 / 우=필터·가이드 (한 줄)
				*/}
				<div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
					<div className="col-start-2 row-start-1 flex flex-wrap items-center justify-end gap-2 md:col-start-3 md:row-start-1">
						<JobDistributionGuide comparisons={comparisons} />
						<ExpeditionTierGuide />
					</div>
					{/* 필터 적용 시에만 인원 요약 표시 */}
					<p className="text-grayscale-500 col-start-1 row-start-2 text-sm tabular-nums md:col-start-1 md:row-start-1">
						{isFilterActive ? `${sortedComparisons.length} / ${comparisons.length}명` : `${comparisons.length}명`}
					</p>
					<div className="col-start-2 row-start-2 flex justify-end md:col-start-2 md:row-start-1">
						<GuildMemberFilters comparisons={comparisons} filter={filter} onFilterChange={setFilter} />
					</div>
				</div>
				{/* 가로 스크롤은 이 카드(테이블) 안에서만 — 페이지로는 전파되지 않음 */}
				<div className="border-grayscale-200 bg-card shadow-soft w-full min-w-0 overflow-x-auto rounded-xl border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
								<TableHead className="text-grayscale-500 w-12">#</TableHead>
								<TableHead className="text-grayscale-500">이름</TableHead>
								<TableHead className="text-grayscale-500">직업</TableHead>
								<SortableHead
									label="레벨"
									sortKey="level"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.combatPower}
								/>
								<SortableHead
									label="전투력"
									sortKey="combatPower"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.combatPower}
								/>
								<ContentDateHead label="토벌전 (등급)" contentDates={GUILD_CONTENT_UPDATED_AT.expedition} />
								<ContentDateHead label="토벌전 (등수)" contentDates={GUILD_CONTENT_UPDATED_AT.expedition} />
								<SortableHead
									label="토벌전 (점수)"
									sortKey="expeditionScore"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.expedition}
								/>
								<SortableHead
									label="대항전"
									sortKey="rivalry"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.rivalry}
								/>
								<SortableHead
									label="수련장"
									sortKey="training"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.training}
								/>
								<SortableHead
									label="길드보스"
									sortKey="guildBoss"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentDates={GUILD_CONTENT_UPDATED_AT.guildBoss}
								/>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedComparisons.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={11} className="text-grayscale-400 h-24 text-center">
										{isFilterActive ? '조건에 맞는 길드원이 없습니다.' : '길드원이 없습니다.'}
									</TableCell>
								</TableRow>
							) : (
								sortedComparisons.map((comparison, index) => (
									<TableRow key={comparison.name} className={cn(comparison.status === 'left' && 'opacity-60')}>
										<TableCell className="text-grayscale-400">{index + 1}</TableCell>
										<TableCell>
											{/* 이름은 주 정보, 자세히 보기는 이름 아래 보조 링크로 배치 */}
											<div className="flex flex-col items-start gap-0.5">
												<span className="inline-flex items-center font-bold">
													{/* 잠금 시 별칭, 해제 시 실명 — row key는 실명 유지 */}
													<MemberDisplayName name={comparison.name} />
													<MemberStatusBadge status={comparison.status} />
												</span>
												<MemberDetailDialog comparison={comparison} />
											</div>
										</TableCell>
										<TableCell>
											<JobBadge job={comparison.job} />
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.level.currentLabel)}>
												{comparison.level.currentLabel}
											</div>
											<GrowthDelta value={comparison.level.diffLabel} />
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.combatPower.currentLabel)}>
												{comparison.combatPower.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.combatPower.diffLabel}
												percentLabel={comparison.combatPower.diffPercentLabel}
											/>
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.expeditionGrade.currentLabel)}>
												{comparison.expeditionGrade.currentLabel}
											</div>
											<GrowthDelta value={comparison.expeditionGrade.diffLabel} />
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.expeditionPlacement.currentLabel)}>
												{comparison.expeditionPlacement.currentLabel}
											</div>
											<GrowthDelta value={comparison.expeditionPlacement.diffLabel} />
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.expeditionScore.currentLabel)}>
												{comparison.expeditionScore.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.expeditionScore.diffLabel}
												percentLabel={comparison.expeditionScore.diffPercentLabel}
											/>
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.rivalry.currentLabel)}>
												{comparison.rivalry.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.rivalry.diffLabel}
												percentLabel={comparison.rivalry.diffPercentLabel}
											/>
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.training.currentLabel)}>
												{comparison.training.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.training.diffLabel}
												percentLabel={comparison.training.diffPercentLabel}
											/>
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.guildBoss.currentLabel)}>
												{comparison.guildBoss.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.guildBoss.diffLabel}
												percentLabel={comparison.guildBoss.diffPercentLabel}
											/>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</TooltipProvider>
	)
}

export default GuildMemberTable
