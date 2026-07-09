'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
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
					<Button variant="outline" size="sm" className="text-grayscale-600 gap-1.5">
						<UsersIcon className="size-4" />
						직업 분포
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>길드 직업 분포</DialogTitle>
					<DialogDescription>
						이번 주 길드원 기준 직업·계열별 인원 현황입니다. (총 {distribution.totalMembers}명)
					</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 max-h-80 overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
								<TableHead className="text-grayscale-500 w-20">계열</TableHead>
								<TableHead className="text-grayscale-500">직업</TableHead>
								<TableHead className="text-grayscale-500 text-right">
									<button
										type="button"
										onClick={handleCountSort}
										className={cn(
											'hover:text-grayscale-900 ml-auto inline-flex items-center gap-1 transition-colors',
											'text-grayscale-900'
										)}
									>
										인원수
										<span className="text-[10px]">{countSortDirection === 'desc' ? '▼' : '▲'}</span>
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedRows.map((row) => (
								<TableRow key={row.job}>
									<TableCell className="text-grayscale-500">{row.classLine}</TableCell>
									<TableCell className="font-medium">{row.job}</TableCell>
									<TableCell className="text-right">{row.count}명</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default JobDistributionGuide
