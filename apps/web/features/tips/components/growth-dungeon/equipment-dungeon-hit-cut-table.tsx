import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { EQUIPMENT_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 장비 던전 단계별 제한시간·처치 수·명중컷 표.
 */
function EquipmentDungeonHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead
						className={cn(
							'bg-grayscale-100 text-grayscale-600 xs:w-[14%] w-[16%] text-center text-xs md:w-[12%] md:text-sm'
						)}
					>
						단계
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-yellow-100 text-pastel-yellow-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[22%] md:px-3 md:text-sm'
						)}
					>
						제한 시간 (초)
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-green-100 text-pastel-green-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[28%] md:px-3 md:text-sm'
						)}
					>
						처치 수 (마리)
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-[40%] px-1.5 text-center text-xs leading-tight md:w-[38%] md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{EQUIPMENT_DUNGEON_HIT_CUT_ENTRIES.map(
					({ stage, timeLimitSec, requiredKillCount, requiredHit, isHardStage }) => (
						<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									isHardStage ? 'bg-red-100 text-red-900' : 'bg-grayscale-50 text-grayscale-800'
								)}
							>
								{stage}
							</TableCell>
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-yellow-50 text-grayscale-900'
								)}
							>
								{formatLocaleNumber(timeLimitSec)}
							</TableCell>
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-green-50 text-grayscale-900'
								)}
							>
								{formatLocaleNumber(requiredKillCount)}
							</TableCell>
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-blue-50 text-grayscale-900'
								)}
							>
								{formatLocaleNumber(requiredHit)}
							</TableCell>
						</TableRow>
					)
				)}
			</TableBody>
		</HitCutTableShell>
	)
}

export default EquipmentDungeonHitCutTable
