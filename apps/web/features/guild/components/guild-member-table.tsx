'use client'

import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { useMemo, useState } from 'react'

import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import { GrowthDelta, MemberStatusBadge } from '@/features/guild/components/growth-delta'
import JobDistributionGuide from '@/features/guild/components/job-distribution-guide'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'

type SortKey = 'combatPower' | 'expeditionScore' | 'rivalry' | 'training' | 'guildBoss' | 'level'
type SortDirection = 'asc' | 'desc'

type GuildMemberTableProps = {
	comparisons: GuildMemberComparison[]
}

function getSortValue(comparison: GuildMemberComparison, key: SortKey): bigint | number {
	switch (key) {
		case 'combatPower':
			return comparison.combatPower.current
		case 'expeditionScore':
			return comparison.expeditionScore.current
		case 'rivalry':
			return comparison.rivalry.current
		case 'training':
			return comparison.training.current
		case 'guildBoss':
			// 값이 없는 멤버는 정렬 시 항상 하단으로 보냄
			return comparison.guildBoss.hasValue ? comparison.guildBoss.current : -1n
		case 'level':
			return comparison.level.current
	}
}

type SortHandler = (sortKey: SortKey) => void

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
					'hover:text-grayscale-900 inline-flex items-center gap-1 transition-colors',
					isActive ? 'text-grayscale-900' : 'text-grayscale-500'
				)}
			>
				{label}
				<span className="text-[10px]">{isActive ? (sortDirection === 'desc' ? '▼' : '▲') : '↕'}</span>
			</button>
		</TableHead>
	)
}

function GuildMemberTable({ comparisons }: GuildMemberTableProps) {
	const [sortKey, setSortKey] = useState<SortKey>('combatPower')
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

	const sortedComparisons = useMemo(() => {
		const next = [...comparisons]

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
	}, [comparisons, sortDirection, sortKey])

	function handleSort(nextKey: SortKey) {
		if (sortKey === nextKey) {
			setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
			return
		}

		setSortKey(nextKey)
		setSortDirection('desc')
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-end gap-2">
				<JobDistributionGuide comparisons={comparisons} />
				<ExpeditionTierGuide />
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
							<SortableHead
								label="수련장"
								sortKey="training"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<SortableHead
								label="길드보스"
								sortKey="guildBoss"
								activeSortKey={sortKey}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedComparisons.map((comparison, index) => (
							<TableRow key={comparison.name} className={cn(comparison.status === 'left' && 'opacity-60')}>
								<TableCell className="text-grayscale-400">{index + 1}</TableCell>
								<TableCell className="font-medium">
									{comparison.name}
									<MemberStatusBadge status={comparison.status} />
								</TableCell>
								<TableCell>{comparison.job}</TableCell>
								<TableCell>
									<div>{comparison.level.current}</div>
									<GrowthDelta value={comparison.level.diffLabel} />
								</TableCell>
								<TableCell>
									<div>{comparison.combatPower.currentLabel}</div>
									<GrowthDelta
										value={comparison.combatPower.diffLabel}
										percentLabel={comparison.combatPower.diffPercentLabel}
									/>
								</TableCell>
								<TableCell>
									<div>{comparison.expeditionGrade.current}</div>
									<GrowthDelta value={comparison.expeditionGrade.diffLabel} />
								</TableCell>
								<TableCell>
									<div>{comparison.expeditionScore.currentLabel}</div>
									<GrowthDelta
										value={comparison.expeditionScore.diffLabel}
										percentLabel={comparison.expeditionScore.diffPercentLabel}
									/>
								</TableCell>
								<TableCell>
									<div>{comparison.rivalry.currentLabel}</div>
									<GrowthDelta
										value={comparison.rivalry.diffLabel}
										percentLabel={comparison.rivalry.diffPercentLabel}
									/>
								</TableCell>
								<TableCell>
									<div>{comparison.training.currentLabel}</div>
									<GrowthDelta
										value={comparison.training.diffLabel}
										percentLabel={comparison.training.diffPercentLabel}
									/>
								</TableCell>
								<TableCell>
									<div>{comparison.guildBoss.currentLabel}</div>
									<GrowthDelta
										value={comparison.guildBoss.diffLabel}
										percentLabel={comparison.guildBoss.diffPercentLabel}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default GuildMemberTable
