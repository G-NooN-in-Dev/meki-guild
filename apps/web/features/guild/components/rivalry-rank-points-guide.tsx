'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { CircleHelpIcon } from 'lucide-react'

import {
	getRivalryRankPointTextClass,
	getRivalryRankPointTone,
	RIVALRY_RANK_POINT_BANDS,
	RIVALRY_RANK_POINT_ENTRIES,
	RIVALRY_RANK_POINT_TONE_META,
	type RivalryRankPointBand,
	type RivalryRankPointEntry
} from '@/libs/rivalry-rank-points.constants'
import { formatLocaleNumber, formatPlacementRank } from '@/utils/format-korean-number'

type RivalryRankPointRow = { type: 'band'; band: RivalryRankPointBand } | { type: 'rank'; entry: RivalryRankPointEntry }

/** 감소폭이 바뀌는 구간 헤더를 끼워 한 덩어리로 보이지 않게 합니다. */
function buildRivalryRankPointRows(
	bands: readonly RivalryRankPointBand[],
	entries: readonly RivalryRankPointEntry[]
): RivalryRankPointRow[] {
	const rows: RivalryRankPointRow[] = []

	for (const band of bands) {
		rows.push({ type: 'band', band })

		for (const entry of entries) {
			if (entry.rank >= band.fromRank && entry.rank <= band.toRank) {
				rows.push({ type: 'rank', entry })
			}
		}
	}

	return rows
}

function RivalryRankPointsGuide() {
	const rows = buildRivalryRankPointRows(RIVALRY_RANK_POINT_BANDS, RIVALRY_RANK_POINT_ENTRIES)

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="대항전 순위별 포인트"
					>
						<CircleHelpIcon className="size-4" />
						{/* 태블릿 이하는 짧은 라벨, lg 이상에서 전체 문구 */}
						<span className="lg:hidden">대항</span>
						<span className="hidden lg:inline">대항전 순위별 포인트</span>
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>대항전 길드 포인트</DialogTitle>
					{/* DialogDescription 기본 태그는 <p>라서, 문단이 둘 이상이면 div로 렌더해야 hydration 오류가 없다 */}
					<DialogDescription render={<div />} className="space-y-1">
						<p>대항전 개인 순위에 따라 길드 포인트가 지급됩니다.</p>
						<p>순위가 낮아질수록 구간별로 감소폭이 달라집니다.</p>
					</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 bg-card shadow-soft max-h-[60dvh] overflow-y-auto rounded-xl border sm:max-h-[65dvh]">
					<Table containerClassName="overflow-visible">
						<TableHeader sticky className="[&>tr>th]:bg-grayscale-100">
							<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">순위</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									포인트
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => {
								if (row.type === 'band') {
									const { fromRank, toRank } = row.band
									const { headerClassName } = RIVALRY_RANK_POINT_TONE_META[getRivalryRankPointTone(fromRank)]

									return (
										<TableRow key={`band-${fromRank}-${toRank}`} className="hover:bg-transparent">
											<TableCell
												colSpan={2}
												className={cn(
													'border-grayscale-200 px-3 py-1.5 text-[11px] font-semibold tracking-wide',
													headerClassName
												)}
											>
												{fromRank}~{toRank} 위
											</TableCell>
										</TableRow>
									)
								}

								const { rank, points } = row.entry

								return (
									<TableRow key={rank} className="border-grayscale-100 hover:bg-grayscale-50/80">
										<TableCell className={cn('px-3 py-2.5 tabular-nums', getRivalryRankPointTextClass(rank))}>
											{formatPlacementRank(rank)}
										</TableCell>
										<TableCell className="text-grayscale-900 px-3 py-2.5 font-semibold tabular-nums">
											{formatLocaleNumber(points)}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default RivalryRankPointsGuide
