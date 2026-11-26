import { Table } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { type ReactNode } from 'react'

/** 명중컷 표 셀 공통 — 가운데 정렬 + tabular-nums */
const HIT_CUT_CELL_BASE_CLASS_NAME =
	'px-1.5 py-2 text-center text-xs font-semibold tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

/**
 * 파스텔 칸 본문 글자.
 */
const HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME = 'text-grayscale-900'

/**
 * 본문 파스텔 칸 배경
 * 헤더(카드색 위 *-500/45)보다 옅다. 텍스트는 `HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME`과 함께 쓴다.
 */
const HIT_CUT_PASTEL_CELL_BG_CLASS_NAME = {
	blue: 'bg-pastel-blue-50 dark:bg-pastel-blue-500/25 dark:text-grayscale-900',
	orange: 'bg-pastel-orange-50 dark:bg-pastel-orange-500/25 dark:text-grayscale-900',
	green: 'bg-pastel-green-50 dark:bg-pastel-green-500/25 dark:text-grayscale-900',
	yellow: 'bg-pastel-yellow-50 dark:bg-pastel-yellow-500/25 dark:text-grayscale-900',
	purple: 'bg-pastel-purple-50 dark:bg-pastel-purple-500/25 dark:text-grayscale-900'
} as const

/**
 * 파스텔 헤더 칸.
 */
const HIT_CUT_PASTEL_HEAD_CLASS_NAME = {
	blue: 'bg-pastel-blue-100 text-pastel-blue-900 dark:bg-card dark:bg-linear-to-r dark:from-pastel-blue-500/45 dark:to-pastel-blue-500/45 dark:text-grayscale-900',
	orange:
		'bg-pastel-orange-100 text-pastel-orange-900 dark:bg-card dark:bg-linear-to-r dark:from-pastel-orange-500/45 dark:to-pastel-orange-500/45 dark:text-grayscale-900',
	green:
		'bg-pastel-green-100 text-pastel-green-900 dark:bg-card dark:bg-linear-to-r dark:from-pastel-green-500/45 dark:to-pastel-green-500/45 dark:text-grayscale-900',
	yellow:
		'bg-pastel-yellow-100 text-pastel-yellow-900 dark:bg-card dark:bg-linear-to-r dark:from-pastel-yellow-500/45 dark:to-pastel-yellow-500/45 dark:text-grayscale-900',
	purple:
		'bg-pastel-purple-100 text-pastel-purple-900 dark:bg-card dark:bg-linear-to-r dark:from-pastel-purple-500/45 dark:to-pastel-purple-500/45 dark:text-grayscale-900'
} as const

/**
 * 단계·라벨 열 헤더.
 * 너비·패딩은 호출측에서 붙입니다.
 */
const HIT_CUT_NEUTRAL_HEAD_CLASS_NAME = 'bg-grayscale-100 text-grayscale-600'

/**
 * 단계·라벨 열 본문 칸.
 * 너비·줄바꿈은 호출측에서 붙입니다.
 */
const HIT_CUT_NEUTRAL_CELL_CLASS_NAME = 'bg-grayscale-50 text-grayscale-800'

/** isHard 행에서 단계 라벨 다음 수치 칸. */
const HIT_CUT_HARD_CELL_CLASS_NAME = 'bg-red-50 text-red-900 dark:bg-red-500/30 dark:text-red-200'

/**
 * isHard 단계(첫 열) 라벨.
 */
const HIT_CUT_HARD_STAGE_LABEL_CLASS_NAME = 'bg-red-100 text-red-900 dark:bg-red-700/20 dark:text-danger-500'

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

export {
	HIT_CUT_CELL_BASE_CLASS_NAME,
	HIT_CUT_HARD_CELL_CLASS_NAME,
	HIT_CUT_HARD_STAGE_LABEL_CLASS_NAME,
	HIT_CUT_NEUTRAL_CELL_CLASS_NAME,
	HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
	HIT_CUT_ON_LIGHT_SURFACE_TEXT_CLASS_NAME,
	HIT_CUT_PASTEL_CELL_BG_CLASS_NAME,
	HIT_CUT_PASTEL_HEAD_CLASS_NAME,
	HitCutTableShell
}
