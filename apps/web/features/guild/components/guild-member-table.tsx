'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import GrowthDelta, { MemberStatusBadge } from '@/features/guild/components/growth-delta'
import GuildMemberToolbar from '@/features/guild/components/guild-member-toolbar'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDetailDialog from '@/features/guild/components/member-detail-dialog'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import MemberPortrait from '@/features/guild/components/member-portrait'
import type { MemberRankings } from '@/features/guild/lib/compute-member-rankings'
import {
	createEmptyGuildMemberFilter,
	filterGuildMembers,
	type GuildMemberFilterState,
	isGuildMemberFilterActive
} from '@/features/guild/lib/filter-guild-members'
import {
	type GuildMemberSortDirection,
	type GuildMemberSortKey,
	sortGuildMembers
} from '@/features/guild/lib/sort-guild-members'
import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getExpeditionGradeTextClass } from '@/libs/expedition-guild-tier.constants'
import { getGuildContentsOrder } from '@/libs/guild-contents-order.constants'

/** 고정 컬럼 9개 + 표시 순서 컨텐츠 컬럼 수 (빈 행 colSpan용) */
const GUILD_MEMBER_TABLE_COLUMN_COUNT = 9 + getGuildContentsOrder().length

/**
 * 가로 스크롤 시 #·이름 열을 왼쪽에 고정합니다.
 * 이름 열 `left-10`는 # 열 너비(`w-10`)와 같아야 겹치지 않습니다.
 */
const stickyIndexHeadClassName = 'sticky left-0 w-10 min-w-10'
/** 이름 열: 모바일은 텍스트만, lg+는 초상화(size-8)+gap 만큼 너비 확보 */
const stickyNameHeadClassName = 'sticky left-10 min-w-24 border-r border-grayscale-200 lg:min-w-32'
const stickyIndexCellClassName = 'sticky left-0 z-[1] w-10 min-w-10 bg-card group-hover:bg-grayscale-50'
const stickyNameCellClassName =
	'sticky left-10 z-[1] min-w-24 border-r border-grayscale-200 bg-card group-hover:bg-grayscale-50 lg:min-w-32'

type GuildMemberTableProps = {
	comparisons: GuildMemberComparison[]
	rankings: MemberRankings
	previousRankings: MemberRankings
}

type SortHandler = (sortKey: GuildMemberSortKey) => void

function getValueClassName(label: string): string {
	return label === GUILD_EMPTY_VALUE_LABEL ? 'text-grayscale-400' : ''
}

type SortableHeadProps = {
	label: string
	sortKey: GuildMemberSortKey
	activeSortKey: GuildMemberSortKey
	sortDirection: GuildMemberSortDirection
	onSort: SortHandler
}

function SortableHead({ label, sortKey, activeSortKey, sortDirection, onSort }: SortableHeadProps) {
	const isActive = activeSortKey === sortKey

	return (
		<TableHead>
			<button
				type="button"
				onClick={() => onSort(sortKey)}
				className={cn(
					'hover:text-grayscale-900 inline-flex cursor-pointer items-center gap-1 transition-colors',
					isActive ? 'text-grayscale-900' : 'text-grayscale-500'
				)}
			>
				{label}
				<span className="text-[10px]">{isActive ? (sortDirection === 'desc' ? '▼' : '▲') : '↕'}</span>
			</button>
		</TableHead>
	)
}

function GuildMemberTable({ comparisons, rankings, previousRankings }: GuildMemberTableProps) {
	const [sortKey, setSortKey] = useState<GuildMemberSortKey>('combatPower')
	const [sortDirection, setSortDirection] = useState<GuildMemberSortDirection>('desc')
	/** ON이면 컬럼 헤더 정렬을 절대값이 아닌 증감율(%) 기준으로 적용 */
	const [sortByPercent, setSortByPercent] = useState(false)
	const [filter, setFilter] = useState<GuildMemberFilterState>(createEmptyGuildMemberFilter)

	// 필터 → 정렬 순으로 적용해, 좁혀진 목록만 테이블에 표시
	const filteredComparisons = filterGuildMembers(comparisons, filter)
	const sortedComparisons = sortGuildMembers(filteredComparisons, { sortKey, sortDirection, sortByPercent })
	const isFilterActive = isGuildMemberFilterActive(filter)

	function handleSort(nextKey: GuildMemberSortKey) {
		if (sortKey === nextKey) {
			setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
			return
		}

		setSortKey(nextKey)
		setSortDirection('desc')
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-3">
			<GuildMemberToolbar
				comparisons={comparisons}
				visibleCount={sortedComparisons.length}
				isFilterActive={isFilterActive}
				sortByPercent={sortByPercent}
				onSortByPercentChange={setSortByPercent}
				filter={filter}
				onFilterChange={setFilter}
			/>
			{/* 가로·세로 스크롤을 카드 안에서만 — 헤더 고정은 Table 컨테이너가 스크롤 기준이어야 함 */}
			<div className="border-grayscale-200 bg-card shadow-soft w-full min-w-0 overflow-hidden rounded-xl border">
				<Table containerClassName="max-h-[min(70dvh,48rem)] overflow-auto">
					<TableHeader sticky className="[&>tr>th]:bg-grayscale-50 [&>tr>th:nth-child(-n+2)]:z-20">
						<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
							<TableHead className={cn('text-grayscale-500', stickyIndexHeadClassName)}>#</TableHead>
							<TableHead className={cn('text-grayscale-500', stickyNameHeadClassName)}>이름</TableHead>
							<TableHead className="text-grayscale-500">직업</TableHead>
							<SortableHead
								label="레벨"
								sortKey="level"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<SortableHead
								label="전투력"
								sortKey="combatPower"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<TableHead className="text-grayscale-500">토벌전 (등급)</TableHead>
							<SortableHead
								label="토벌전 (등수)"
								sortKey="expeditionPlacement"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<SortableHead
								label="토벌전 (점수)"
								sortKey="expeditionScore"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<SortableHead
								label="대항전"
								sortKey="rivalry"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							{getGuildContentsOrder().map(({ key, label }) => (
								<SortableHead
									key={key}
									label={label}
									sortKey={key}
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
								/>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedComparisons.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={GUILD_MEMBER_TABLE_COLUMN_COUNT} className="text-grayscale-400 h-24 text-center">
									{isFilterActive ? '조건에 맞는 길드원이 없습니다.' : '길드원이 없습니다.'}
								</TableCell>
							</TableRow>
						) : (
							sortedComparisons.map((comparison, index) => {
								// 이탈은 성장이 아니라 부재이므로, 0−이전값으로 만든 delta는 표시하지 않음
								const showGrowthDelta = comparison.status !== 'left'

								return (
									<TableRow key={comparison.name} className={cn('group', comparison.status === 'left' && 'opacity-60')}>
										<TableCell className={cn('text-grayscale-400', stickyIndexCellClassName)}>{index + 1}</TableCell>
										<TableCell className={stickyNameCellClassName}>
											{/* 데스크탑: 초상화 + 이름. 모바일은 이름만 */}
											<div className="flex items-center gap-2">
												<MemberPortrait
													name={comparison.name}
													size="sm"
													className="hidden size-8 rounded-lg lg:block"
													zoom={2.25}
												/>
												{/* 이름은 주 정보, 자세히 보기는 이름 아래 보조 링크로 배치 */}
												<div className="flex min-w-0 flex-col items-start gap-0.5">
													<span className="inline-flex items-center font-bold">
														{/* 잠금 시 별칭, 해제 시 실명 — row key는 실명 유지 */}
														<MemberDisplayName name={comparison.name} />
														<MemberStatusBadge status={comparison.status} />
													</span>
													<MemberDetailDialog
														comparison={comparison}
														rankings={rankings}
														previousRankings={previousRankings}
													/>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<JobBadge job={comparison.job} />
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.level.currentLabel)}>
												{comparison.level.currentLabel}
											</div>
											{showGrowthDelta ? <GrowthDelta value={comparison.level.diffLabel} /> : null}
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.combatPower.currentLabel)}>
												{comparison.combatPower.currentLabel}
											</div>
											{showGrowthDelta ? (
												<GrowthDelta
													value={comparison.combatPower.diffLabel}
													percentLabel={comparison.combatPower.diffPercentLabel}
												/>
											) : null}
										</TableCell>
										<TableCell>
											<div
												className={cn(
													getValueClassName(comparison.expeditionGrade.currentLabel),
													getExpeditionGradeTextClass(comparison.expeditionGrade.currentLabel)
												)}
											>
												{comparison.expeditionGrade.currentLabel}
											</div>
											{showGrowthDelta ? <GrowthDelta value={comparison.expeditionGrade.diffLabel} /> : null}
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.expeditionPlacement.currentLabel)}>
												{comparison.expeditionPlacement.currentLabel}
											</div>
											{showGrowthDelta ? <GrowthDelta value={comparison.expeditionPlacement.diffLabel} /> : null}
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.expeditionScore.currentLabel)}>
												{comparison.expeditionScore.currentLabel}
											</div>
											{showGrowthDelta ? (
												<GrowthDelta
													value={comparison.expeditionScore.diffLabel}
													percentLabel={comparison.expeditionScore.diffPercentLabel}
												/>
											) : null}
										</TableCell>
										<TableCell>
											<div className={getValueClassName(comparison.rivalry.currentLabel)}>
												{comparison.rivalry.currentLabel}
											</div>
											{showGrowthDelta ? (
												<GrowthDelta
													value={comparison.rivalry.diffLabel}
													percentLabel={comparison.rivalry.diffPercentLabel}
												/>
											) : null}
										</TableCell>
										{getGuildContentsOrder().map(({ key }) => {
											const metric = comparison[key]

											return (
												<TableCell key={key}>
													<div className={getValueClassName(metric.currentLabel)}>{metric.currentLabel}</div>
													{showGrowthDelta ? (
														<GrowthDelta value={metric.diffLabel} percentLabel={metric.diffPercentLabel} />
													) : null}
												</TableCell>
											)
										})}
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default GuildMemberTable
