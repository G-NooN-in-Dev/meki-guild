import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { GUILD_RIVALRY_HIT_CUT_ENTRIES } from '@/features/tips/lib/guild-rivalry-hit-cut.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 길드 대항전 단계별 명중컷·보스 데미지 증가 스택 표.
 * table-fixed로 열 비율을 고정하고, 모바일에서는 촘촘한 패딩을 씁니다.
 */
function GuildRivalryHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead
						className={cn(
							'bg-grayscale-100 text-grayscale-600 xs:w-[15%] w-1/5 text-center text-xs md:w-[12%] md:text-sm'
						)}
					>
						단계
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-green-100 text-pastel-green-900 xs:px-2 w-2/5 px-1.5 text-center text-xs leading-tight break-keep md:px-3 md:text-sm'
						)}
					>
						보스 데미지 증가 스택
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-2/5 px-1.5 text-center text-xs leading-tight md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{GUILD_RIVALRY_HIT_CUT_ENTRIES.map(({ stage, buffStack, requiredHit }) => (
					<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800')}>
							{stage}
						</TableCell>
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-green-50 text-grayscale-900')}>
							{formatLocaleNumber(buffStack)}
						</TableCell>
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-blue-50 text-grayscale-900')}>
							{formatLocaleNumber(requiredHit)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</HitCutTableShell>
	)
}

export default GuildRivalryHitCutTable
