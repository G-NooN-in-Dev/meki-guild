import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	HIT_CUT_CELL_BASE_CLASS_NAME,
	HIT_CUT_NEUTRAL_CELL_CLASS_NAME,
	HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
	HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME,
	HIT_CUT_PASTEL_CELL_BG_CLASS_NAME,
	HIT_CUT_PASTEL_HEAD_CLASS_NAME,
	HitCutTableShell
} from '@/features/tips/components/shared/hit-cut-table-shell'
import { WORLD_BOSS_ENTRIES } from '@/features/tips/lib/world-boss.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 월드보스 단계별 방어력·필요 명중 표.
 * table-fixed로 열 비율을 고정하고, 모바일에서는 촘촘한 패딩을 씁니다.
 */
function WorldBossTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead
						className={cn(
							HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
							'xs:w-[15%] w-1/5 text-center text-xs md:w-[12%] md:text-sm'
						)}
					>
						단계
					</TableHead>
					<TableHead
						className={cn(
							HIT_CUT_PASTEL_HEAD_CLASS_NAME.orange,
							'xs:px-2 w-2/5 px-1.5 text-center text-xs leading-tight break-keep md:px-3 md:text-sm'
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
				{WORLD_BOSS_ENTRIES.map(({ stage, defense, requiredHit }) => (
					<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, HIT_CUT_NEUTRAL_CELL_CLASS_NAME)}>{stage}</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.orange,
								HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME
							)}
						>
							{formatLocaleNumber(defense)}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.blue,
								HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME
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

export default WorldBossTable
