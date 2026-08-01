import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'

import {
	CONTENT_DIFFICULTIES,
	CONTENT_KIND_LABELS,
	CONTENT_STAGE_CUT_COLUMN_MAPS,
	CONTENT_STAGE_ROWS,
	formatStageCutLabel,
	getDifficultyChipClassName,
	type ParsedStageCut
} from '@/features/tips/lib/content-stage-cut.constants'
import type { ContentStageCutEntry } from '@/features/tips/types/content-stage-cut.type'

const COLUMN_COUNT = CONTENT_STAGE_CUT_COLUMN_MAPS.length

/** 난이도 색 안내 — 한 줄·작은 스와치로만 표시 */
function DifficultyLegend() {
	return (
		<ul className="text-grayscale-600 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm">
			{CONTENT_DIFFICULTIES.map(({ key, label, chipClassName }) => (
				<li key={key} className="inline-flex items-center gap-1.5">
					<span className={cn('size-2.5 shrink-0 rounded-sm md:size-3', chipClassName)} aria-hidden />
					{label}
				</li>
			))}
		</ul>
	)
}

/** 열 헤더: 모바일은 촘촘, 데스크탑은 여유 있는 타이포 */
function ContentColumnHeader({ entry }: { entry: ContentStageCutEntry }) {
	const { name, kind } = entry

	return (
		<div className="flex h-full flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-center md:gap-1.5 md:px-2 md:py-4">
			<span className="text-grayscale-500 text-[0.55rem] leading-tight font-medium md:text-sm">
				{CONTENT_KIND_LABELS[kind]}
			</span>
			<span className="text-grayscale-900 text-[0.65rem] leading-tight font-semibold break-keep md:text-base">
				{name}
			</span>
		</div>
	)
}

/**
 * 보상 행.
 * 모바일: 세로 스택 / 데스크탑: 가로 나열 (최대 2개라 한 줄이면 충분)
 */
function ContentRewardCell({ rewards }: { rewards: ContentStageCutEntry['rewards'] }) {
	return (
		<div className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 md:flex-row md:flex-wrap md:gap-1.5 md:px-2 md:py-2.5">
			{rewards.map((reward) => (
				<Badge
					key={reward}
					variant="secondary"
					className="border-grayscale-300 bg-grayscale-200 text-grayscale-800 h-5 max-w-full truncate rounded-md border px-1 text-[0.6rem] font-semibold md:h-7 md:px-2.5 md:text-xs"
				>
					{reward}
				</Badge>
			))}
		</div>
	)
}

/**
 * 스테이지컷 셀.
 * 모바일·데스크탑 모두 셀 전체에 난이도 색을 칠합니다.
 */
function StageCutCell({ cut, isOddRow }: { cut: ParsedStageCut | undefined; isOddRow: boolean }) {
	if (!cut) {
		return (
			<div
				className={cn(
					'border-grayscale-200 flex min-h-6 items-center justify-center border-r last:border-r-0 md:min-h-10 lg:min-h-12',
					isOddRow ? 'bg-grayscale-50/70' : 'bg-background'
				)}
			>
				<span className="text-grayscale-300 text-[0.65rem] md:text-base" aria-hidden>
					·
				</span>
			</div>
		)
	}

	const { raw, difficulty } = cut
	const label = formatStageCutLabel(raw)

	return (
		<div
			className={cn(
				'border-grayscale-200/40 flex min-h-6 items-center justify-center border-r px-0.5 last:border-r-0 md:min-h-10 lg:min-h-12',
				getDifficultyChipClassName(difficulty)
			)}
		>
			<span className="text-[0.7rem] font-bold tabular-nums md:text-base lg:text-lg">{label}</span>
		</div>
	)
}

/**
 * 컨텐츠 열 × 스테이지컷 행 타임라인.
 * 레전드 + 차트를 묶어서 섹션에서 한 번에 배치합니다.
 */
function ContentStageCutChart() {
	const gridStyle = {
		display: 'grid' as const,
		gridTemplateColumns: `repeat(${COLUMN_COUNT}, minmax(0, 1fr))`,
		width: '100%'
	}

	return (
		<div className="flex flex-col gap-2.5">
			<DifficultyLegend />

			<div className="border-grayscale-200 bg-background overflow-x-auto rounded-xl border shadow-sm">
				<div className="min-w-0" style={gridStyle}>
					{CONTENT_STAGE_CUT_COLUMN_MAPS.map(({ entry }) => (
						<div
							key={`title-${entry.name}`}
							className="border-grayscale-200 bg-grayscale-50 border-r border-b last:border-r-0"
						>
							<ContentColumnHeader entry={entry} />
						</div>
					))}

					{CONTENT_STAGE_CUT_COLUMN_MAPS.map(({ entry }) => (
						<div
							key={`reward-${entry.name}`}
							className="border-grayscale-200 bg-grayscale-50/80 border-r border-b last:border-r-0"
						>
							<ContentRewardCell rewards={entry.rewards} />
						</div>
					))}

					{CONTENT_STAGE_ROWS.map((row, rowIndex) =>
						CONTENT_STAGE_CUT_COLUMN_MAPS.map(({ entry, byRaw }) => (
							<StageCutCell key={`${entry.name}-${row.raw}`} cut={byRaw.get(row.raw)} isOddRow={rowIndex % 2 === 1} />
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default ContentStageCutChart
