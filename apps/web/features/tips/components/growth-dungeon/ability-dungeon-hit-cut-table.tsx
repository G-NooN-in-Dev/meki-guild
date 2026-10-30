import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import HitPairCell from '@/features/tips/components/shared/hit-pair-cell'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { ABILITY_DUNGEON_HIT_CUT_ENTRIES } from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/** 한 칸 안에서 값을 나누는 슬래시 */
const SLASH_CLASS_NAME = 'text-grayscale-400 text-[10px] leading-none font-normal'

type DefenseCellProps = {
	defense: number
	buffDefense: number
	bossDefense: number
	className?: string
}

/**
 * 일반 / 라이오너·샐리온 / 엘리쟈 방어력.
 * 열을 나누면 모바일 너비가 부족해서 한 칸에 나란히 적습니다.
 */
function DefenseCell({ defense, buffDefense, bossDefense, className }: DefenseCellProps) {
	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1', className)}>
			<span className="flex items-center justify-center gap-1">
				<span>{formatLocaleNumber(defense)}</span>
				<span className={SLASH_CLASS_NAME}>/</span>
				<span>{formatLocaleNumber(buffDefense)}</span>
				<span className={SLASH_CLASS_NAME}>/</span>
				<span>{formatLocaleNumber(bossDefense)}</span>
			</span>
		</TableCell>
	)
}

/**
 * 용사의 수련장 단계별 방어력·명중컷 표.
 * 방어력은 일반·라이오너·샐리온·엘리쟈를, 필요 명중은 일반과 나머지를 함께 보여 줍니다.
 * 라이오너·샐리온·엘리쟈 필요 명중은 같은 값이라 오른쪽은 한 숫자입니다.
 */
function AbilityDungeonHitCutTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600 w-[12%]')}>단계</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-orange-100 text-pastel-orange-900 w-[58%]')}>
						<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
							<span>방어력</span>
							<span className={HEAD_HINT_CLASS_NAME}>(일반 / 라이오너·샐리온 / 엘리쟈)</span>
						</span>
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-blue-100 text-pastel-blue-900 w-[30%]')}>
						<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
							<span>필요 명중</span>
							<span className={HEAD_HINT_CLASS_NAME}>(일반 / 나머지)</span>
						</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{ABILITY_DUNGEON_HIT_CUT_ENTRIES.map(
					({ stage, defense, buffDefense, bossDefense, requiredHit, buffRequiredHit, isHardStage }) => (
						<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									isHardStage ? 'bg-red-100 text-red-900' : 'bg-grayscale-50 text-grayscale-800'
								)}
							>
								{stage}
							</TableCell>
							<DefenseCell
								defense={defense}
								buffDefense={buffDefense}
								bossDefense={bossDefense}
								className={isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-orange-50 text-grayscale-900'}
							/>
							<HitPairCell
								requiredHit={requiredHit}
								pairedRequiredHit={buffRequiredHit}
								className={isHardStage ? 'bg-red-50 text-red-900' : 'bg-pastel-blue-50 text-grayscale-900'}
							/>
						</TableRow>
					)
				)}
			</TableBody>
		</HitCutTableShell>
	)
}

export default AbilityDungeonHitCutTable
