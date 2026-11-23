'use client'

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	getGuildRivalryRankPointTextClass,
	getGuildRivalryRankPointTone,
	GUILD_RIVALRY_RANK_POINT_DISPLAY_BANDS,
	GUILD_RIVALRY_RANK_POINT_ENTRIES,
	GUILD_RIVALRY_RANK_POINT_TONE_META,
	type GuildRivalryRankPointDisplayBand,
	type GuildRivalryRankPointEntry
} from '@/features/guild/lib/guild-rivalry-rank-points.constants'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import TipsReferenceDisclosure from '@/features/tips/components/shared/tips-reference-disclosure'
import { formatLocaleNumber, formatPlacementRank } from '@/utils/format-korean-number'

type RankPointRow =
	{ type: 'band'; band: GuildRivalryRankPointDisplayBand } | { type: 'rank'; entry: GuildRivalryRankPointEntry }

/** 표시용 구간 헤더를 끼워 표가 한 덩어리로 보이지 않게 합니다. */
function buildGuildRivalryRankPointRows(
	bands: readonly GuildRivalryRankPointDisplayBand[],
	entries: readonly GuildRivalryRankPointEntry[]
): RankPointRow[] {
	const rows: RankPointRow[] = []

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

function formatGuildRivalryRankPointBandLabel(fromRank: number, toRank: number): string {
	if (fromRank === toRank) {
		return `${fromRank}위`
	}

	return `${fromRank}~${toRank}위`
}

const HEAD_CLASS_NAME =
	'bg-grayscale-100 text-grayscale-600 h-auto px-1.5 py-2 text-center text-xs leading-tight xs:px-2 md:px-3 md:text-sm'

function RankPointsTableBody({ rows }: { rows: readonly RankPointRow[] }) {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, 'w-1/2')}>순위</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'w-1/2')}>포인트</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => {
					if (row.type === 'band') {
						const { fromRank, toRank } = row.band
						const { headerClassName } = GUILD_RIVALRY_RANK_POINT_TONE_META[getGuildRivalryRankPointTone(fromRank)]

						return (
							<TableRow key={`band-${fromRank}-${toRank}`} className="hover:bg-transparent">
								<TableCell
									colSpan={2}
									className={cn(
										'border-grayscale-200 px-3 py-1.5 text-left text-[11px] font-semibold tracking-wide',
										headerClassName
									)}
								>
									{formatGuildRivalryRankPointBandLabel(fromRank, toRank)}
								</TableCell>
							</TableRow>
						)
					}

					const { rank, points } = row.entry

					return (
						<TableRow key={rank} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, getGuildRivalryRankPointTextClass(rank))}>
								{formatPlacementRank(rank)}
							</TableCell>
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'text-grayscale-900')}>
								{formatLocaleNumber(points)}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</HitCutTableShell>
	)
}

/**
 * 대항전 개인 순위별 길드 포인트 표.
 * lg+ Collapsible / 모바일 Dialog.
 */
function GuildRivalryRankPointsTable() {
	const rows = buildGuildRivalryRankPointRows(GUILD_RIVALRY_RANK_POINT_DISPLAY_BANDS, GUILD_RIVALRY_RANK_POINT_ENTRIES)

	return (
		<TipsReferenceDisclosure
			title="순위별 길드 포인트"
			description="개인 순위에 따라 길드 포인트가 지급되며, 순위가 낮아질수록 구간별로 감소폭이 달라집니다."
		>
			<RankPointsTableBody rows={rows} />
		</TipsReferenceDisclosure>
	)
}

export default GuildRivalryRankPointsTable
