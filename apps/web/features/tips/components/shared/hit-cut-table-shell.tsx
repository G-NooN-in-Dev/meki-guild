import { Table } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { type ReactNode } from 'react'

/** 명중컷 표 셀 공통 — 가운데 정렬 + tabular-nums */
const HIT_CUT_CELL_BASE_CLASS_NAME =
	'px-1.5 py-2 text-center text-xs font-semibold tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

type HitCutTableShellProps = {
	children: ReactNode
	/** 기본: 세로 스크롤 max-height. boss-raid 등에서는 false */
	scrollable?: boolean
	tableClassName?: string
	className?: string
}

/**
 * 명중컷 표 공통 셸 — sticky header + table-fixed 컨테이너.
 * 열 구성은 호출측 TableHeader/TableBody에서 정의합니다.
 */
function HitCutTableShell({ children, scrollable = true, tableClassName, className }: HitCutTableShellProps) {
	return (
		<div
			className={cn(
				'border-grayscale-200 bg-card shadow-soft overflow-auto rounded-xl border',
				scrollable && 'max-h-[min(65dvh,36rem)] md:max-h-[min(70dvh,40rem)]',
				className
			)}
		>
			<Table className={cn('w-full table-fixed', tableClassName)} containerClassName="overflow-visible">
				{children}
			</Table>
		</div>
	)
}

export { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell }
