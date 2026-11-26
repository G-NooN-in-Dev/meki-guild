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
import HitPairCell from '@/features/tips/components/shared/hit-pair-cell'
import { EXPERIENCE_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/**
 * 경험치 던전 단계별 방어력·처치 수·명중컷 표.
 * 필요 명중 칸은 일반 몬스터와 주니어 부기를 함께 보여 줍니다.
 */
function ExperienceDungeonHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, HIT_CUT_NEUTRAL_HEAD_CLASS_NAME, 'w-[13%] md:w-[12%]')}>
						단계
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, HIT_CUT_PASTEL_HEAD_CLASS_NAME.green, 'w-[23%] md:w-[24%]')}>
						필요 처치 수 <span className="text-[10px] leading-none font-normal opacity-80 sm:text-xs">(마리)</span>
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, HIT_CUT_PASTEL_HEAD_CLASS_NAME.orange, 'w-[22%]')}>
						방어력
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, HIT_CUT_PASTEL_HEAD_CLASS_NAME.blue, 'w-[42%]')}>
						<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
							<span>필요 명중</span>
							<span className="text-[10px] leading-none font-normal opacity-80 sm:text-xs">(일반 / 주니어 부기)</span>
						</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{EXPERIENCE_DUNGEON_HIT_CUT_ENTRIES.map(
					({ stage, defense, requiredKillCount, requiredHit, juniorBoogieRequiredHit, isHardStage }) => (
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
										: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.green, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
								)}
							>
								{formatLocaleNumber(requiredKillCount)}
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
							<HitPairCell
								requiredHit={requiredHit}
								pairedRequiredHit={juniorBoogieRequiredHit}
								className={
									isHardStage
										? HIT_CUT_HARD_CELL_CLASS_NAME
										: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.blue, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
								}
							/>
						</TableRow>
					)
				)}
			</TableBody>
		</HitCutTableShell>
	)
}

export default ExperienceDungeonHitCutTable
