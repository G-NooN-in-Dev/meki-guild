'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getJobClassLineBadgeClass, getJobTextClass } from '@/libs/job-class.constants'
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
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>길드 직업 분포 (총 {distribution.totalMembers}명)</DialogTitle>
					<DialogDescription hidden />
				</DialogHeader>
				{/* 순백 배경은 pastel text와 대비가 약해, 살짝 톤 내린 회색 배경으로 가독성을 맞춤 */}
				<div className="border-grayscale-200 bg-grayscale-100 max-h-80 overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-200/70 hover:bg-grayscale-200/70 border-grayscale-200">
								<TableHead className="text-grayscale-600 w-24">계열</TableHead>
								<TableHead className="text-grayscale-600">직업</TableHead>
								<TableHead className="text-grayscale-600 text-right">
									<button
										type="button"
										onClick={handleCountSort}
										className={cn(
											'hover:text-grayscale-900 ml-auto inline-flex items-center gap-1 transition-colors hover:cursor-pointer',
											'text-grayscale-800'
										)}
									>
										인원수
										<span className="text-[10px]">{countSortDirection === 'desc' ? '▼' : '▲'}</span>
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedRows.map((row) => {
								const { classLine, job, count } = row
								const jobTextClass = getJobTextClass(job)

								return (
									<TableRow key={job} className="border-grayscale-200/80 bg-grayscale-100 hover:bg-grayscale-200/50">
										{/* 계열: Badge / 직업·인원: 직업별 text 색 */}
										<TableCell>
											<Badge variant="outline" className={getJobClassLineBadgeClass(classLine)}>
												{classLine}
											</Badge>
										</TableCell>
										<TableCell className={cn('font-medium', jobTextClass)}>{job}</TableCell>
										<TableCell className={cn('text-right tabular-nums', jobTextClass)}>{count}명</TableCell>
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
