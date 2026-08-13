import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import RelicAwakeningCellControl from '@/features/tips/components/relic-awakening-cell-control'
import RelicEffectLineList from '@/features/tips/components/relic-effect-line-list'
import RelicIdentity from '@/features/tips/components/relic-identity'
import { ITEM_GRADE_SLOT_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { RelicEffectRow } from '@/features/tips/types/relic.type'

const nameHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[26%] min-w-0 px-2 text-left text-xs sm:w-[22%] sm:px-3 sm:text-sm md:w-[20%]'
const nameCellClassName =
	'bg-grayscale-50 sticky left-0 z-[1] w-[26%] min-w-0 px-2 py-2.5 align-middle sm:w-[22%] sm:px-3 sm:py-3 md:w-[20%]'
/** 각성 열 — 별(warning) 톤으로 구분 */
const stageHeaderClassName =
	'bg-warning-100 text-warning-700 w-[7.5rem] min-w-[7.5rem] px-1.5 py-2 text-center text-xs sm:w-32 sm:min-w-32 sm:text-sm'
const stageCellClassName =
	'bg-warning-50 w-[7.5rem] min-w-[7.5rem] px-1.5 py-2.5 text-center align-middle sm:w-32 sm:min-w-32'
const effectHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 min-w-0 px-2 py-2 text-left text-xs sm:px-3 sm:text-sm'
const effectCellClassName = 'min-w-0 px-2 py-2.5 align-middle sm:px-3 sm:py-3'
const possessionHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 w-[22%] min-w-[8.5rem] px-2 py-2 text-left text-xs sm:w-[20%] sm:min-w-[10rem] sm:px-3 sm:text-sm'
const possessionCellClassName = 'w-[22%] min-w-[8.5rem] px-2 py-2.5 align-middle sm:w-[20%] sm:min-w-[10rem] sm:px-3'

type RelicEffectDesktopTableProps = {
	rows: readonly RelicEffectRow[]
	onStageChange: (relicId: string, stage: number) => void
}

/** 데스크탑용 4열 표. 각성 한 칸이 장착·보유 수치를 같이 바꿉니다. */
function RelicEffectDesktopTable({ rows, onStageChange }: RelicEffectDesktopTableProps) {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(70dvh,44rem)] overflow-auto rounded-xl border">
			<Table className="w-full min-w-3xl" containerClassName="overflow-visible">
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className={nameHeaderClassName}>유물</TableHead>
						<TableHead className={stageHeaderClassName}>각성</TableHead>
						<TableHead className={effectHeaderClassName}>장착 효과</TableHead>
						<TableHead className={possessionHeaderClassName}>보유 효과</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map(({ relic, stage, equipLines, possessionLines }) => (
						<TableRow key={relic.id} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(nameCellClassName, ITEM_GRADE_SLOT_CLASS[relic.grade])}>
								<RelicIdentity relic={relic} />
							</TableCell>
							<TableCell className={stageCellClassName}>
								<RelicAwakeningCellControl stage={stage} onStageChange={(next) => onStageChange(relic.id, next)} />
							</TableCell>
							<TableCell className={effectCellClassName}>
								<RelicEffectLineList lines={equipLines} lineKeyPrefix={`${relic.id}-equip`} />
							</TableCell>
							<TableCell className={possessionCellClassName}>
								<RelicEffectLineList lines={possessionLines} lineKeyPrefix={`${relic.id}-possession`} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default RelicEffectDesktopTable
