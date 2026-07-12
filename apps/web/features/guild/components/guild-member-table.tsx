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
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_UNENTERED_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { getGuildContentUpdatedAtLabel, GUILD_CONTENT_UPDATED_AT } from '@/libs/guild-content-dates.constants'
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
	/** 최근 주 스냅샷 수집일 (YYYY-MM-DD) */
	currentUpdatedAt: string
	/** 직전 주 스냅샷 수집일 (YYYY-MM-DD) */
	previousUpdatedAt: string
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
	return label === GUILD_UNENTERED_LABEL ? 'text-grayscale-400' : ''
}

type SortableHeadProps = {
	label: string
	sortKey: SortKey
	activeSortKey: SortKey
	sortDirection: SortDirection
	onSort: SortHandler
	/** 컨텐츠별 최근 수집일. 있으면 헤더에 툴팁 표시 */
	contentUpdatedAt?: string | null
}

type ContentDateHeadProps = {
	label: string
	contentUpdatedAt: string | null
}

function ContentDateHead({ label, contentUpdatedAt }: ContentDateHeadProps) {
	return (
		<TableHead className="text-grayscale-500">
			<Tooltip>
				<TooltipTrigger
					render={
						<span className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4">
							{label}
						</span>
					}
				/>
				<TooltipContent>{getGuildContentUpdatedAtLabel(contentUpdatedAt)}</TooltipContent>
			</Tooltip>
		</TableHead>
	)
}

function SortableHead({ label, sortKey, activeSortKey, sortDirection, onSort, contentUpdatedAt }: SortableHeadProps) {
	const isActive = activeSortKey === sortKey
	const hasContentDate = contentUpdatedAt !== undefined

	return (
		<TableHead>
			<Tooltip>
				<TooltipTrigger
					render={
						<button
							type="button"
							onClick={() => onSort(sortKey)}
							className={cn(
								'hover:text-grayscale-900 inline-flex items-center gap-1 transition-colors hover:cursor-pointer',
								isActive ? 'text-grayscale-900' : 'text-grayscale-500',
								hasContentDate && 'underline decoration-dotted underline-offset-4'
							)}
						>
							{label}
							<span className="text-[10px]">{isActive ? (sortDirection === 'desc' ? '▼' : '▲') : '↕'}</span>
						</button>
					}
				/>
				{hasContentDate ? <TooltipContent>{getGuildContentUpdatedAtLabel(contentUpdatedAt)}</TooltipContent> : null}
			</Tooltip>
		</TableHead>
	)
}

function GuildMemberTable({ comparisons, currentUpdatedAt, previousUpdatedAt }: GuildMemberTableProps) {
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
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between gap-2">
					{/* 필터 적용 시에만 인원 요약 표시 */}
					<p className="text-grayscale-500 text-sm tabular-nums">
						{isFilterActive ? `${sortedComparisons.length} / ${comparisons.length}명` : `${comparisons.length}명`}
					</p>
					<div className="flex items-center gap-2">
						<GuildMemberFilters comparisons={comparisons} filter={filter} onFilterChange={setFilter} />
						<JobDistributionGuide comparisons={comparisons} />
						<ExpeditionTierGuide />
					</div>
				</div>
				<div className="border-grayscale-200 bg-card shadow-soft overflow-hidden rounded-xl border">
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
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.combatPower}
								/>
								<SortableHead
									label="전투력"
									sortKey="combatPower"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.combatPower}
								/>
								<ContentDateHead label="토벌전 (등급)" contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.expedition} />
								<SortableHead
									label="토벌전 (점수)"
									sortKey="expeditionScore"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.expedition}
								/>
								<SortableHead
									label="대항전"
									sortKey="rivalry"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.rivalry}
								/>
								<SortableHead
									label="수련장"
									sortKey="training"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.training}
								/>
								<SortableHead
									label="길드보스"
									sortKey="guildBoss"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
									contentUpdatedAt={GUILD_CONTENT_UPDATED_AT.guildBoss}
								/>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedComparisons.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={10} className="text-grayscale-400 h-24 text-center">
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
													{comparison.name}
													<MemberStatusBadge status={comparison.status} />
												</span>
												<MemberDetailDialog
													comparison={comparison}
													currentUpdatedAt={currentUpdatedAt}
													previousUpdatedAt={previousUpdatedAt}
												/>
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
