import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { ABILITY_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 용사의 수련장 단계별 일반·보스 명중컷 표.
 */
function AbilityDungeonHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead
						className={cn(
							'bg-grayscale-100 text-grayscale-600 xs:w-[16%] w-[18%] text-center text-xs md:w-[14%] md:text-sm'
						)}
					>
						단계
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-[41%] px-1.5 text-center text-xs leading-tight md:w-[43%] md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{ABILITY_DUNGEON_HIT_CUT_ENTRIES.map(({ stage, requiredHit, isHardStage }) => (
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
								isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-blue-50 text-grayscale-900'
							)}
						>
							{formatLocaleNumber(requiredHit)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</HitCutTableShell>
	)
}

export default AbilityDungeonHitCutTable
