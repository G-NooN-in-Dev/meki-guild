import { Badge } from '@shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	getJobReleaseDisplayName,
	JOB_RELEASE_STATS,
	JOB_RELEASED_TABLE_ROWS,
	JOB_UPCOMING_TABLE_ROWS
} from '@/features/tips/lib/job-release-order.constants'
import type { JobReleaseTableRow } from '@/features/tips/types/job-release-order.type'
import { getJobClassLineBadgeClass, type JobClassLine } from '@/libs/job-class.constants'
import { formatDate } from '@/utils/dayjs'

const gridBorderClassName = 'border-grayscale-300 border-r border-b last:border-r-0'
const headerClassName = cn(
	gridBorderClassName,
	'sticky top-0 z-20 bg-grayscale-100 text-grayscale-700 px-2 text-center text-xs lg:px-3 lg:text-sm'
)
const cellClassName = cn(gridBorderClassName, 'px-2 py-2 text-xs whitespace-nowrap lg:px-3 lg:py-2.5 lg:text-sm')

/** YYYY.MM.DD · 원작/메키 두 열이므로 sm 2열 레이아웃에서는 더 좁게 */
const dateColumnClassName = 'w-22 lg:w-28 xl:w-32'
/** 뱃지 1개 기준. xl에서 제논처럼 계열이 둘이면 한 줄에 들어가도록 더 넓힘 */
const classLineColumnClassName = 'w-20 lg:w-28 xl:w-32'

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
	/** false면 메키 출시 열을 숨깁니다. 미출시 표에서 사용합니다. */
	showMekiDate?: boolean
}

/**
 * 출시/미출시 한쪽 표.
 * 넘긴 행의 순서를 그대로 그리므로, 호출 쪽에서 정렬·그룹 기준을 맞춥니다.
 */
function JobReleaseGroupTable({
	title,
	count,
	rows,
	scrollable = true,
	showMekiDate = true
}: JobReleaseGroupTableProps) {
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
							<TableHead className={cn(headerClassName, dateColumnClassName)}>
								{showMekiDate ? (
									<>
										<span className="lg:hidden">원작</span>
										<span className="hidden lg:inline">원작 출시</span>
									</>
								) : (
									'출시 날짜'
								)}
							</TableHead>
							{showMekiDate ? (
								<TableHead className={cn(headerClassName, dateColumnClassName)}>
									<span className="lg:hidden">메키</span>
									<span className="hidden lg:inline">메키 출시</span>
								</TableHead>
							) : null}
							<TableHead className={cn(headerClassName, classLineColumnClassName)}>직업군</TableHead>
							<TableHead className={cn(headerClassName, 'text-left')}>직업명</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child>td]:border-b-0">
						{rows.map((row, index) => {
							const {
								classLines,
								isFirstOfMekiDate,
								isFirstOfOriginalDate,
								job,
								mekiDateRowSpan,
								mekiReleasedAt,
								originalDateRowSpan,
								releasedAt
							} = row
							const zebraClassName = index % 2 === 0 ? 'bg-card' : 'bg-grayscale-50'
							const mergedDateCellClassName = cn(
								cellClassName,
								dateColumnClassName,
								'bg-grayscale-100 text-grayscale-800 text-center font-medium tabular-nums'
							)

							return (
								<TableRow key={job} className="border-0 hover:bg-transparent">
									{isFirstOfOriginalDate ? (
										<TableCell rowSpan={originalDateRowSpan} className={mergedDateCellClassName}>
											{formatDate(releasedAt)}
										</TableCell>
									) : null}
									{showMekiDate ? (
										mekiReleasedAt ? (
											isFirstOfMekiDate ? (
												<TableCell rowSpan={mekiDateRowSpan} className={mergedDateCellClassName}>
													{formatDate(mekiReleasedAt)}
												</TableCell>
											) : null
										) : (
											<TableCell
												className={cn(
													cellClassName,
													dateColumnClassName,
													'text-grayscale-400 text-center tabular-nums',
													zebraClassName
												)}
											>
												—
											</TableCell>
										)
									) : null}
									<TableCell className={cn(cellClassName, classLineColumnClassName, zebraClassName)}>
										<JobClassLineBadges classLines={classLines} />
									</TableCell>
									<TableCell className={cn(cellClassName, 'min-w-0', zebraClassName)}>
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
			<JobReleaseGroupTable
				title="미출시"
				count={upcomingCount}
				rows={JOB_UPCOMING_TABLE_ROWS}
				scrollable={false}
				showMekiDate={false}
			/>
		</div>
	)
}

export default JobReleaseOrderTable
