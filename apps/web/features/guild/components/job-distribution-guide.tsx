'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { GrowthDelta } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getJobClassLineBadgeClass } from '@/libs/job-class.constants'
import { formatArrowDelta } from '@/utils/format-delta-label'
import { calculateJobDistribution, type JobCountSortDirection, sortJobDistributionRows } from '@/utils/job-distribution'

type JobDistributionGuideProps = {
	comparisons: GuildMemberComparison[]
}

function JobDistributionGuide({ comparisons }: JobDistributionGuideProps) {
	const [countSortDirection, setCountSortDirection] = useState<JobCountSortDirection>('desc')

	const distribution = useMemo(() => calculateJobDistribution(comparisons), [comparisons])

	const sortedRows = useMemo(
		() => sortJobDistributionRows(distribution.rows, countSortDirection),
		[distribution.rows, countSortDirection]
	)

	function handleCountSort() {
		setCountSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))
	}

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-600 shrink-0 gap-1.5" aria-label="직업 분포">
						<UsersIcon className="size-4" />
						{/* 모바일은 짧은 라벨, md 이상에서 전체 문구 */}
						<span className="md:hidden">직업</span>
						<span className="hidden md:inline">직업 분포</span>
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:p-6">
				<DialogHeader>
					<DialogTitle>길드 직업 분포 (총 {distribution.totalMembers}명)</DialogTitle>
					<DialogDescription hidden />
				</DialogHeader>
				<div className="border-grayscale-200 bg-grayscale-50 max-h-[60dvh] overflow-y-auto rounded-lg border sm:max-h-[65dvh]">
					<Table>
						<TableHeader className="bg-grayscale-50 sticky top-0 z-10">
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50 border-grayscale-200">
								<TableHead className="text-grayscale-500 w-24">직업군</TableHead>
								<TableHead className="text-grayscale-500">직업</TableHead>
								<TableHead className="text-grayscale-500 text-right">
									<button
										type="button"
										onClick={handleCountSort}
										className={cn(
											'hover:text-grayscale-900 ml-auto inline-flex items-center gap-1 transition-colors hover:cursor-pointer',
											'text-grayscale-700'
										)}
									>
										인원수
										<span className="text-[10px]">{countSortDirection === 'desc' ? '▼' : '▲'}</span>
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedRows.map((row, index) => {
								const { classLine, job, count, previousCount } = row
								const diff = count - previousCount
								// 직전 주와 인원이 다를 때만 "2명 → 1명" + ▲/▼ 증감 표시
								const countChanged = diff !== 0
								const isEmpty = count === 0 && previousCount === 0

								return (
									<TableRow
										key={job}
										className={cn(
											'border-grayscale-200',
											index % 2 === 0 ? 'bg-card' : 'bg-grayscale-50',
											'hover:bg-grayscale-100/80',
											// 인원 0인 행은 한 단계 눌러 실제 인원 행이 돋보이게
											isEmpty && 'opacity-55'
										)}
									>
										<TableCell>
											<Badge variant="outline" className={getJobClassLineBadgeClass(classLine)}>
												{classLine}
											</Badge>
										</TableCell>
										{/* 직업 식별은 pastel text 대신 Badge(배경+글자)로 — 밝은 줄에서도 대비가 안정적 */}
										<TableCell>
											<JobBadge job={job} />
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{countChanged ? (
												<span className="inline-flex items-center justify-end gap-1.5">
													<span className="text-grayscale-400 text-sm">{previousCount}명</span>
													<span className="text-grayscale-300 text-xs">→</span>
													<span className="text-grayscale-900 font-semibold">{count}명</span>
													<GrowthDelta value={formatArrowDelta(diff)} />
												</span>
											) : (
												<span className={cn('font-medium', count === 0 ? 'text-grayscale-400' : 'text-grayscale-900')}>
													{count}명
												</span>
											)}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default JobDistributionGuide
