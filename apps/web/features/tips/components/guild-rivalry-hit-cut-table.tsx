import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { GUILD_RIVALRY_HIT_CUT_ENTRIES } from '@/features/tips/lib/guild-rivalry-hit-cut.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 열 공통 — 가운데 정렬 + 숫자 정렬 */
const cellBaseClassName =
	'px-1.5 py-2 text-center text-xs font-semibold tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

/**
 * 길드 대항전 단계별 명중컷·보스 데미지 증가 스택 표.
 * table-fixed로 열 비율을 고정하고, 모바일에서는 촘촘한 패딩을 씁니다.
 */
function GuildRivalryHitCutTable() {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(65dvh,36rem)] overflow-auto rounded-xl border md:max-h-[min(70dvh,40rem)]">
			{/* table-fixed + w-full — 좁은 화면에서도 가로 스크롤 없이 3열이 들어가게 */}
			<Table className="w-full table-fixed">
				<TableHeader className="sticky top-0 z-20">
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
							<TableCell className={cn(cellBaseClassName, 'bg-grayscale-50 text-grayscale-800')}>{stage}</TableCell>
							<TableCell className={cn(cellBaseClassName, 'bg-pastel-green-50 text-grayscale-900')}>
								{formatLocaleNumber(buffStack)}
							</TableCell>
							<TableCell className={cn(cellBaseClassName, 'bg-pastel-blue-50 text-grayscale-900')}>
								{formatLocaleNumber(requiredHit)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default GuildRivalryHitCutTable
