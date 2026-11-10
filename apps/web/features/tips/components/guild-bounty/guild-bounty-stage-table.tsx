import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { GUILD_BOUNTY_TIPS_ENTRIES } from '@/features/tips/lib/guild-bounty.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

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
						className={cn('bg-grayscale-100 text-grayscale-600 w-[12%] text-center text-xs md:w-[10%] md:text-sm')}
					>
						단계
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[22.5%] md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-orange-100 text-pastel-orange-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[22.5%] md:px-3 md:text-sm'
						)}
					>
						방어력
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-green-100 text-pastel-green-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-[22.5%] md:px-3 md:text-sm'
						)}
					>
						클리어 점수
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-yellow-100 text-pastel-yellow-900 xs:px-2 h-auto w-[22%] px-1 text-center text-xs leading-tight break-keep whitespace-normal md:w-[22.5%] md:px-3 md:text-sm'
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
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-orange-50 text-grayscale-900'
							)}
						>
							{formatLocaleNumber(defense)}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-green-50 text-grayscale-900'
							)}
						>
							{formatLocaleNumber(clearScore)}
						</TableCell>
						<TableCell
							className={cn(
								HIT_CUT_CELL_BASE_CLASS_NAME,
								isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-yellow-50 text-grayscale-900'
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
