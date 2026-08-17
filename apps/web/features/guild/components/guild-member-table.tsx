'use client'

import { Label } from '@shared/ui/label'
import { cn } from '@shared/ui/lib/utils'
import { Switch } from '@shared/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { useState } from 'react'

import ContentUpdatedAtGuide from '@/features/guild/components/content-updated-at-guide'
import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import GrowthDelta, { MemberStatusBadge } from '@/features/guild/components/growth-delta'
import GuildMemberFilters from '@/features/guild/components/guild-member-filters'
import JobBadge from '@/features/guild/components/job-badge'
import JobDistributionGuide from '@/features/guild/components/job-distribution-guide'
import MemberDetailDialog from '@/features/guild/components/member-detail-dialog'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import RivalryRankPointsGuide from '@/features/guild/components/rivalry-rank-points-guide'
import WeeklyGrowthLeaders from '@/features/guild/components/weekly-growth-leaders'
import type { MemberRankings } from '@/features/guild/lib/compute-member-rankings'
import {
	createEmptyGuildMemberFilter,
	filterGuildMembers,
	type GuildMemberFilterState,
	isGuildMemberFilterActive
} from '@/features/guild/lib/filter-guild-members'
import type { GuildMemberComparison, LevelDelta, NumericDelta } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_EMPTY_VALUE_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { getExpeditionGradeTextClass } from '@/libs/expedition-guild-tier.constants'
import { isGuildMetricVisible } from '@/libs/guild-metric-visibility.constants'

type SortKey =
	'combatPower' | 'expeditionScore' | 'expeditionPlacement' | 'rivalry' | 'training' | 'guildBoss' | 'level'
type SortDirection = 'asc' | 'desc'

/** 고정 컬럼 9개 + 표시 중인 수련장·길드보스 컬럼 수 (빈 행 colSpan용) */
const GUILD_MEMBER_TABLE_COLUMN_COUNT =
	9 + (isGuildMetricVisible('training') ? 1 : 0) + (isGuildMetricVisible('guildBoss') ? 1 : 0)

/**
 * 가로 스크롤 시 #·이름 열을 왼쪽에 고정합니다.
 * 이름 열 `left-12`는 # 열 너비(`w-12`)와 같아야 겹치지 않습니다.
 */
const stickyIndexHeadClassName = 'sticky left-0 w-12 min-w-12'
const stickyNameHeadClassName = 'sticky left-12 min-w-28 border-r border-grayscale-200'
const stickyIndexCellClassName = 'sticky left-0 z-[1] w-12 min-w-12 bg-card group-hover:bg-grayscale-50'
const stickyNameCellClassName =
	'sticky left-12 z-[1] min-w-28 border-r border-grayscale-200 bg-card group-hover:bg-grayscale-50'

type GuildMemberTableProps = {
	comparisons: GuildMemberComparison[]
	rankings: MemberRankings
	previousRankings: MemberRankings
}

/** 증감율 비교 불가(신규·이전값 없음·0)일 때 쓰는 정렬용 센티널 — 내림차순에서 맨 아래 */
const MISSING_PERCENT_SORT_VALUE = Number.NEGATIVE_INFINITY

/**
 * NumericDelta의 증감율을 정렬용 숫자로 변환합니다.
 * (diff / previous) * 100 과 동일하되, bigint 정수 연산으로 소수 정밀도를 유지합니다.
 */
function getNumericPercentSortValue(delta: NumericDelta): number {
	if (!delta.hasValue || delta.diff === null || delta.previous === null || delta.previous === 0n) {
		return MISSING_PERCENT_SORT_VALUE
	}

	// 소수점 2자리까지 반영: (diff / previous) * 10000 → 나중에 /100 한 것과 같은 순서
	return Number((delta.diff * 10000n) / delta.previous)
}

/**
 * 레벨 증감 정렬 값.
 * 레벨은 %가 아니라 몇 올랐는지(diff) 그 자체로 비교합니다.
 */
function getLevelChangeSortValue(delta: LevelDelta): number {
	if (!delta.hasValue || delta.diff === null) {
		return MISSING_PERCENT_SORT_VALUE
	}

	return delta.diff
}

/**
 * 토벌전 등수 증감 정렬 값.
 * raw diff는 (현재−이전)이라 음수=상승이므로, desc에서 상승이 위로 오도록 부호를 뒤집습니다.
 */
function getPlacementChangeSortValue(delta: LevelDelta): number {
	if (!delta.hasValue || delta.diff === null) {
		return MISSING_PERCENT_SORT_VALUE
	}

	return -delta.diff
}

/**
 * 컬럼별 정렬 값을 뽑습니다.
 * sortByPercent=true면 절대값 대신 증감 기준으로 비교합니다.
 * (전투력 등은 %, 레벨은 증가량, 등수는 상승량)
 */
function getSortValue(comparison: GuildMemberComparison, key: SortKey, sortByPercent: boolean): bigint | number {
	if (sortByPercent) {
		switch (key) {
			case 'combatPower':
				return getNumericPercentSortValue(comparison.combatPower)
			case 'expeditionScore':
				return getNumericPercentSortValue(comparison.expeditionScore)
			case 'expeditionPlacement':
				return getPlacementChangeSortValue(comparison.expeditionPlacement)
			case 'rivalry':
				return getNumericPercentSortValue(comparison.rivalry)
			case 'training':
				return getNumericPercentSortValue(comparison.training)
			case 'guildBoss':
				return getNumericPercentSortValue(comparison.guildBoss)
			case 'level':
				return getLevelChangeSortValue(comparison.level)
		}
	}

	switch (key) {
		case 'combatPower':
			return comparison.combatPower.hasValue ? comparison.combatPower.current : -1n
		case 'expeditionScore':
			return comparison.expeditionScore.hasValue ? comparison.expeditionScore.current : -1n
		case 'expeditionPlacement':
			// 등수는 작을수록 상위. 부호를 뒤집어 desc=상위 등수 먼저가 됩니다.
			return comparison.expeditionPlacement.hasValue
				? -comparison.expeditionPlacement.current
				: MISSING_PERCENT_SORT_VALUE
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

/**
 * 주 정렬 값이 같을 때 보조 정렬.
 * desc: 레벨 절대값 높은 순 → 전투력 높은 순
 * asc: 둘 다 반대로 (레벨 낮은 순 → 전투력 낮은 순)
 */
function compareTieBreakers(
	left: GuildMemberComparison,
	right: GuildMemberComparison,
	sortDirection: SortDirection
): number {
	const isAscending = sortDirection === 'asc'
	const leftLevel = left.level.hasValue ? left.level.current : -1
	const rightLevel = right.level.hasValue ? right.level.current : -1

	if (leftLevel !== rightLevel) {
		return isAscending ? leftLevel - rightLevel : rightLevel - leftLevel
	}

	const leftCombat = left.combatPower.hasValue ? left.combatPower.current : -1n
	const rightCombat = right.combatPower.hasValue ? right.combatPower.current : -1n

	if (leftCombat !== rightCombat) {
		if (isAscending) {
			return leftCombat < rightCombat ? -1 : 1
		}

		return leftCombat > rightCombat ? -1 : 1
	}

	return 0
}

type SortHandler = (sortKey: SortKey) => void

function getValueClassName(label: string): string {
	return label === GUILD_EMPTY_VALUE_LABEL ? 'text-grayscale-400' : ''
}

type SortableHeadProps = {
	label: string
	sortKey: SortKey
	activeSortKey: SortKey
	sortDirection: SortDirection
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
	const [sortKey, setSortKey] = useState<SortKey>('combatPower')
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
	/** ON이면 컬럼 헤더 정렬을 절대값이 아닌 증감율(%) 기준으로 적용 */
	const [sortByPercent, setSortByPercent] = useState(false)
	const [filter, setFilter] = useState<GuildMemberFilterState>(createEmptyGuildMemberFilter)

	// 필터 → 정렬 순으로 적용해, 좁혀진 목록만 테이블에 표시
	const filteredComparisons = filterGuildMembers(comparisons, filter)

	const sortedComparisons = (() => {
		const next = [...filteredComparisons]

		next.sort((left, right) => {
			if (left.status === 'left' && right.status !== 'left') {
				return 1
			}

			if (left.status !== 'left' && right.status === 'left') {
				return -1
			}

			const leftValue = getSortValue(left, sortKey, sortByPercent)
			const rightValue = getSortValue(right, sortKey, sortByPercent)

			// 주 정렬 값이 같으면 전투력 → 레벨 순으로 보조 정렬
			if (leftValue === rightValue) {
				return compareTieBreakers(left, right, sortDirection)
			}

			const isAscending = sortDirection === 'asc'

			if (typeof leftValue === 'bigint' && typeof rightValue === 'bigint') {
				return isAscending ? (leftValue < rightValue ? -1 : 1) : leftValue > rightValue ? -1 : 1
			}

			return isAscending
				? (leftValue as number) - (rightValue as number)
				: (rightValue as number) - (leftValue as number)
		})

		return next
	})()

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
		<div className="flex w-full min-w-0 flex-col gap-3">
			{/*
				  모바일: 1행=인원·증감율·필터 / 2행=가이드
				  데스크탑: 한 줄 — 좌=인원 / 우=조작·가이드 (md:contents로 조작 행을 펼침)
				*/}
			<div className="flex w-full min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
				<div className="flex items-center justify-between gap-2 md:contents">
					{/* 필터 적용 시에만 인원 요약 표시 — md:mr-auto로 조작·가이드를 오른쪽으로 밀어냄 */}
					<p className="text-grayscale-500 text-sm tabular-nums md:mr-auto">
						{isFilterActive ? `${sortedComparisons.length} / ${comparisons.length}명` : `${comparisons.length}명`}
					</p>
					<div className="flex items-center gap-2 md:gap-3">
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
								onCheckedChange={setSortByPercent}
								aria-label="증감율 기준 정렬"
							/>
						</Label>
						<GuildMemberFilters comparisons={comparisons} filter={filter} onFilterChange={setFilter} />
					</div>
				</div>
				{/* 참고용 가이드 — 모바일은 보조 행, 좁으면 가로 스크롤 */}
				<div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
					<WeeklyGrowthLeaders comparisons={comparisons} />
					<ContentUpdatedAtGuide />
					<JobDistributionGuide comparisons={comparisons} />
					<ExpeditionTierGuide />
					<RivalryRankPointsGuide />
				</div>
			</div>
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
							{isGuildMetricVisible('training') ? (
								<SortableHead
									label="수련장"
									sortKey="training"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
								/>
							) : null}
							{isGuildMetricVisible('guildBoss') ? (
								<SortableHead
									label="길드보스"
									sortKey="guildBoss"
									activeSortKey={sortKey}
									sortDirection={sortDirection}
									onSort={handleSort}
								/>
							) : null}
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
							sortedComparisons.map((comparison, index) => (
								<TableRow key={comparison.name} className={cn('group', comparison.status === 'left' && 'opacity-60')}>
									<TableCell className={cn('text-grayscale-400', stickyIndexCellClassName)}>{index + 1}</TableCell>
									<TableCell className={stickyNameCellClassName}>
										{/* 이름은 주 정보, 자세히 보기는 이름 아래 보조 링크로 배치 */}
										<div className="flex flex-col items-start gap-0.5">
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
										<div
											className={cn(
												getValueClassName(comparison.expeditionGrade.currentLabel),
												getExpeditionGradeTextClass(comparison.expeditionGrade.currentLabel)
											)}
										>
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
									{isGuildMetricVisible('training') ? (
										<TableCell>
											<div className={getValueClassName(comparison.training.currentLabel)}>
												{comparison.training.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.training.diffLabel}
												percentLabel={comparison.training.diffPercentLabel}
											/>
										</TableCell>
									) : null}
									{isGuildMetricVisible('guildBoss') ? (
										<TableCell>
											<div className={getValueClassName(comparison.guildBoss.currentLabel)}>
												{comparison.guildBoss.currentLabel}
											</div>
											<GrowthDelta
												value={comparison.guildBoss.diffLabel}
												percentLabel={comparison.guildBoss.diffPercentLabel}
											/>
										</TableCell>
									) : null}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default GuildMemberTable
