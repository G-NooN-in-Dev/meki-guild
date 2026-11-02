import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { GUILD_EXPEDITION_ENTRIES } from '@/features/tips/lib/guild-expedition.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/**
 * 길드 토벌전 단계별 제한시간·방어력·명중컷 표.
 */
function GuildExpeditionTable() {
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
							'bg-pastel-green-100 text-pastel-green-900 xs:px-2 h-auto w-[26%] px-1 text-center text-xs leading-tight break-keep whitespace-normal md:w-[18%] md:px-3 md:text-sm'
						)}
					>
						제한시간 <span className={HEAD_HINT_CLASS_NAME}>(초)</span>
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-orange-100 text-pastel-orange-900 xs:px-2 w-[31%] px-1.5 text-center text-xs leading-tight break-keep md:w-[36%] md:px-3 md:text-sm'
						)}
					>
						방어력
					</TableHead>
					<TableHead
						className={cn(
							'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-[31%] px-1.5 text-center text-xs leading-tight md:w-[36%] md:px-3 md:text-sm'
						)}
					>
						필요 명중
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{GUILD_EXPEDITION_ENTRIES.map(({ stage, timeLimitSec, defense, requiredHit }) => (
					<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800')}>
							{stage}
						</TableCell>
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-green-50 text-grayscale-900')}>
							{formatLocaleNumber(timeLimitSec)}
						</TableCell>
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-orange-50 text-grayscale-900')}>
							{formatLocaleNumber(defense)}
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

export default GuildExpeditionTable
