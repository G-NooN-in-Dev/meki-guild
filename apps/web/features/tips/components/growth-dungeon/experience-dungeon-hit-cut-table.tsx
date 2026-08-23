import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { EXPERIENCE_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 열 공통 — 가운데 정렬 + 숫자 정렬 */
const cellBaseClassName =
	'px-1.5 py-2 text-center text-xs font-semibold tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

/**
 * 경험치 던전 단계별 처치 수·명중컷 표.
 */
function ExperienceDungeonHitCutTable() {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(65dvh,36rem)] overflow-auto rounded-xl border md:max-h-[min(70dvh,40rem)]">
			<Table className="w-full table-fixed" containerClassName="overflow-visible">
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
								'bg-pastel-green-100 text-pastel-green-900 xs:px-2 w-[22%] px-1.5 text-center text-xs leading-tight md:w-1/4 md:px-3 md:text-sm'
							)}
						>
							처치 수
						</TableHead>
						<TableHead
							className={cn(
								'bg-pastel-blue-100 text-pastel-blue-900 xs:px-2 w-[30%] px-1.5 text-center text-xs leading-tight md:w-[30%] md:px-3 md:text-sm'
							)}
						>
							필요 명중
						</TableHead>
						<TableHead
							className={cn(
								'bg-pastel-yellow-100 text-pastel-yellow-900 xs:px-2 w-[30%] px-1.5 text-center text-xs leading-tight md:w-[31%] md:px-3 md:text-sm'
							)}
						>
							주니어 부기
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{EXPERIENCE_DUNGEON_HIT_CUT_ENTRIES.map(
						({ stage, requiredKillCount, requiredHit, juniorBoogieRequiredHit, isHardStage }) => (
							<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
								<TableCell
									className={cn(
										cellBaseClassName,
										isHardStage ? 'bg-red-100 text-red-900' : 'bg-grayscale-50 text-grayscale-800'
									)}
								>
									{stage}
								</TableCell>
								<TableCell
									className={cn(
										cellBaseClassName,
										isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-green-50 text-grayscale-900'
									)}
								>
									{formatLocaleNumber(requiredKillCount)}
								</TableCell>
								<TableCell
									className={cn(
										cellBaseClassName,
										isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-blue-50 text-grayscale-900'
									)}
								>
									{formatLocaleNumber(requiredHit)}
								</TableCell>
								<TableCell
									className={cn(
										cellBaseClassName,
										isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-yellow-50 text-grayscale-900'
									)}
								>
									{formatLocaleNumber(juniorBoogieRequiredHit)}
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export default ExperienceDungeonHitCutTable
