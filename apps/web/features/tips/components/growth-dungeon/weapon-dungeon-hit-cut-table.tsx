import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	HIT_CUT_CELL_BASE_CLASS_NAME,
	HIT_CUT_HARD_CELL_CLASS_NAME,
	HIT_CUT_HARD_STAGE_LABEL_CLASS_NAME,
	HIT_CUT_NEUTRAL_CELL_CLASS_NAME,
	HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
	HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME,
	HIT_CUT_PASTEL_CELL_BG_CLASS_NAME,
	HIT_CUT_PASTEL_HEAD_CLASS_NAME,
	HitCutTableShell
} from '@/features/tips/components/shared/hit-cut-table-shell'
import { WEAPON_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 무기 던전 단계별 방어력·명중컷 표.
 */
function WeaponDungeonHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HIT_CUT_NEUTRAL_HEAD_CLASS_NAME, 'w-1/5 text-center text-xs md:text-sm')}>
						단계
					</TableHead>
					<TableHead
						className={cn(
							HIT_CUT_PASTEL_HEAD_CLASS_NAME.orange,
							'xs:px-2 w-2/5 px-1.5 text-center text-xs leading-tight md:px-3 md:text-sm'
						)}
					>
						방어력
					</TableHead>
					<TableHead
						className={cn(
							HIT_CUT_PASTEL_HEAD_CLASS_NAME.blue,
							'xs:px-2 w-2/5 px-1.5 text-center text-xs leading-tight md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{WEAPON_DUNGEON_HIT_CUT_ENTRIES.map(({ stage, defense, requiredHit, isHardStage }) => (
					<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage ? HIT_CUT_HARD_STAGE_LABEL_CLASS_NAME : HIT_CUT_NEUTRAL_CELL_CLASS_NAME
							)}
						>
							{stage}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage
									? HIT_CUT_HARD_CELL_CLASS_NAME
									: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.orange, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
							)}
						>
							{formatLocaleNumber(defense)}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage
									? HIT_CUT_HARD_CELL_CLASS_NAME
									: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.blue, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
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

export default WeaponDungeonHitCutTable
