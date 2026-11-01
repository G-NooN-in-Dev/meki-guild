import { TableCell } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME } from '@/features/tips/components/shared/hit-cut-table-shell'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 한 칸 안에서 값을 나누는 슬래시 */
const SLASH_CLASS_NAME = 'text-grayscale-400 text-[10px] leading-none font-normal'

type HitPairCellProps = {
	/** 칸 왼쪽 필요 명중 */
	requiredHit: number
	/** 칸 오른쪽 필요 명중. 던전마다 비교 대상이 다릅니다. */
	pairedRequiredHit: number
	className?: string
}

/**
 * 필요 명중 두 값을 슬래시로 나란히 적는 칸.
 * 열을 나누면 모바일 너비가 부족해서 한 칸에 둡니다.
 */
function HitPairCell({ requiredHit, pairedRequiredHit, className }: HitPairCellProps) {
	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1', className)}>
			<span className="flex items-center justify-center gap-1">
				<span>{formatLocaleNumber(requiredHit)}</span>
				<span className={SLASH_CLASS_NAME}>/</span>
				<span>{formatLocaleNumber(pairedRequiredHit)}</span>
			</span>
		</TableCell>
	)
}

export default HitPairCell
export type { HitPairCellProps }
