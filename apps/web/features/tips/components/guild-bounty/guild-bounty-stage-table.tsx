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
import { GUILD_BOUNTY_TIPS_ENTRIES } from '@/features/tips/lib/guild-bounty.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/** 파스텔 헤더의 너비·정렬. 색은 `HIT_CUT_PASTEL_HEAD_CLASS_NAME`에 둡니다. */
const PASTEL_HEAD_LAYOUT_CLASS_NAME =
	'xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[22.5%] md:px-3 md:text-sm'

/**
 * 현상수배 단계별 방어력·명중컷·클리어/누적 점수 표.
 * 어려운 단계는 빨간 톤으로 강조합니다.
 */
function GuildBountyStageTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead
						className={cn(HIT_CUT_NEUTRAL_HEAD_CLASS_NAME, 'w-[12%] text-center text-xs md:w-[10%] md:text-sm')}
					>
						단계
					</TableHead>
					<TableHead className={cn(HIT_CUT_PASTEL_HEAD_CLASS_NAME.blue, PASTEL_HEAD_LAYOUT_CLASS_NAME)}>
						필요 명중
					</TableHead>
					<TableHead className={cn(HIT_CUT_PASTEL_HEAD_CLASS_NAME.orange, PASTEL_HEAD_LAYOUT_CLASS_NAME)}>
						방어력
					</TableHead>
					<TableHead className={cn(HIT_CUT_PASTEL_HEAD_CLASS_NAME.green, PASTEL_HEAD_LAYOUT_CLASS_NAME)}>
						클리어 점수
					</TableHead>
					<TableHead
						className={cn(
							HIT_CUT_PASTEL_HEAD_CLASS_NAME.yellow,
							'xs:px-2 h-auto w-[22%] px-1 text-center text-xs leading-tight break-keep whitespace-normal md:w-[22.5%] md:px-3 md:text-sm'
						)}
					>
						<span className="flex flex-col items-center gap-0.5">
							<span>누적 점수</span>
							<span className={HEAD_HINT_CLASS_NAME}>(사냥 실적)</span>
						</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{GUILD_BOUNTY_TIPS_ENTRIES.map(({ stage, defense, requiredHit, clearScore, huntingScore, isHardStage }) => (
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
									: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.blue, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
							)}
						>
							{formatLocaleNumber(requiredHit)}
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
									: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.green, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
							)}
						>
							{formatLocaleNumber(clearScore)}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage
									? HIT_CUT_HARD_CELL_CLASS_NAME
									: cn(HIT_CUT_PASTEL_CELL_BG_CLASS_NAME.yellow, HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME)
							)}
						>
							{formatLocaleNumber(huntingScore)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</HitCutTableShell>
	)
}

export default GuildBountyStageTable
