import { Badge } from '@shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	formatReleaseDateLabel,
	getJobReleaseDisplayName,
	JOB_RELEASE_STATS,
	JOB_RELEASED_TABLE_ROWS,
	JOB_UPCOMING_TABLE_ROWS
} from '@/features/tips/lib/job-release-order.constants'
import type { JobReleaseTableRow } from '@/features/tips/types/job-release-order.type'
import { getJobClassLineBadgeClass, type JobClassLine } from '@/libs/job-class.constants'

const gridBorderClassName = 'border-grayscale-300 border-r border-b last:border-r-0'
const headerClassName = cn(
	gridBorderClassName,
	'sticky top-0 z-20 bg-grayscale-100 text-grayscale-700 px-2 text-center text-xs lg:px-3 lg:text-sm'
)
const cellClassName = cn(gridBorderClassName, 'px-2 py-2 text-xs whitespace-nowrap lg:px-3 lg:py-2.5 lg:text-sm')

/** YYYY.MM.DD · sm 2열에서는 좁게, lg부터 헤더 문구가 여유 있게 */
const dateColumnClassName = 'w-28 lg:w-32 xl:w-36'
/** 뱃지 1개 기준. xl에서 제논처럼 계열이 둘이면 한 줄에 들어가도록 더 넓힘 */
const classLineColumnClassName = 'w-24 lg:w-28 xl:w-32'

function JobClassLineBadges({ classLines }: { classLines: readonly JobClassLine[] }) {
	return (
		<div className="flex flex-col items-center justify-center gap-1 xl:flex-row">
			{classLines.map((classLine) => (
				<Badge key={classLine} variant="outline" className={getJobClassLineBadgeClass(classLine)}>
					{classLine}
				</Badge>
			))}
		</div>
	)
}

type JobReleaseGroupTableProps = {
	title: string
	count: number
	rows: readonly JobReleaseTableRow[]
	/** false면 높이 제한 없이 행을 모두 보여 줍니다. 기본은 표 안 스크롤입니다. */
	scrollable?: boolean
}

/**
 * 출시/미출시 한쪽 표.
 * 넘긴 행의 순서를 그대로 그리므로, 호출 쪽에서 원작 출시일 순을 유지합니다.
 */
function JobReleaseGroupTable({ title, count, rows, scrollable = true }: JobReleaseGroupTableProps) {
	return (
		<section className="flex min-w-0 flex-col gap-3">
			<h2 className="text-grayscale-900 text-lg font-semibold md:text-xl">
				{title}
				<span className="text-grayscale-500 ml-2 text-base font-medium tabular-nums">{count}</span>
			</h2>

			{/* scroll을 Table 컨테이너에 두고 border-separate를 써야 thead/th sticky가 동작합니다 */}
			<div
				className={cn(
					'border-grayscale-300 bg-card shadow-soft overflow-hidden rounded-xl border',
					scrollable &&
						'**:data-[slot=table-container]:max-h-[min(70dvh,44rem)] **:data-[slot=table-container]:overflow-auto'
				)}
			>
				<Table className="w-full table-fixed border-separate border-spacing-0">
					<TableHeader className="[&_tr]:border-0">
						<TableRow className="hover:bg-transparent">
							<TableHead className={cn(headerClassName, dateColumnClassName)}>출시 일자</TableHead>
							<TableHead className={cn(headerClassName, classLineColumnClassName)}>직업군</TableHead>
							<TableHead className={cn(headerClassName, 'text-left')}>직업명</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child>td]:border-b-0">
						{rows.map((row, index) => {
							const { classLines, dateRowSpan, isFirstOfDate, job, releasedAt } = row

							return (
								<TableRow key={job} className="border-0 hover:bg-transparent">
									{isFirstOfDate ? (
										<TableCell
											rowSpan={dateRowSpan}
											className={cn(
												cellClassName,
												dateColumnClassName,
												'bg-grayscale-100 text-grayscale-800 text-center font-medium tabular-nums'
											)}
										>
											{formatReleaseDateLabel(releasedAt)}
										</TableCell>
									) : null}
									<TableCell
										className={cn(
											cellClassName,
											classLineColumnClassName,
											index % 2 === 0 ? 'bg-card' : 'bg-grayscale-50'
										)}
									>
										<JobClassLineBadges classLines={classLines} />
									</TableCell>
									<TableCell className={cn(cellClassName, 'min-w-0', index % 2 === 0 ? 'bg-card' : 'bg-grayscale-50')}>
										<span className="text-grayscale-900 font-medium">{getJobReleaseDisplayName(row)}</span>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</section>
	)
}

/**
 * 메키 출시(왼쪽) · 미출시(오른쪽) 두 표.
 * sm 미만은 1열(출시 표가 위), sm(640px)부터 2열.
 * sm~lg는 열·글자를 촘촘히, lg부터 패딩·글자, xl에서 계열 뱃지를 가로로 둡니다.
 */
function JobReleaseOrderTable() {
	const { releasedCount, upcomingCount } = JOB_RELEASE_STATS

	return (
		<div className="grid gap-6 sm:grid-cols-2 sm:items-start lg:gap-8">
			<JobReleaseGroupTable title="출시" count={releasedCount} rows={JOB_RELEASED_TABLE_ROWS} scrollable={false} />
			<JobReleaseGroupTable title="미출시" count={upcomingCount} rows={JOB_UPCOMING_TABLE_ROWS} scrollable={false} />
		</div>
	)
}

export default JobReleaseOrderTable
