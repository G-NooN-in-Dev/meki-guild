'use client'

import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shared/ui/tooltip'
import { useMemo, useState } from 'react'

import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import { GrowthDelta, MemberStatusBadge } from '@/features/guild/components/growth-delta'
import JobDistributionGuide from '@/features/guild/components/job-distribution-guide'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_UNENTERED_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_CONTENT_UPDATED_AT, getGuildContentUpdatedAtLabel } from '@/libs/guild-content-dates.constants'

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
								'hover:text-grayscale-900 inline-flex items-center gap-1 transition-colors',
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
		<TooltipProvider>
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
							{sortedComparisons.map((comparison, index) => (
								<TableRow key={comparison.name} className={cn(comparison.status === 'left' && 'opacity-60')}>
									<TableCell className="text-grayscale-400">{index + 1}</TableCell>
									<TableCell className="font-medium">
										{comparison.name}
										<MemberStatusBadge status={comparison.status} />
									</TableCell>
									<TableCell>{comparison.job}</TableCell>
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
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</TooltipProvider>
	)
}

export default GuildMemberTable
