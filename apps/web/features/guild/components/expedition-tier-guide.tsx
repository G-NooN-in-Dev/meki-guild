'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { CircleHelpIcon } from 'lucide-react'

import {
	EXPEDITION_GUILD_TIERS,
	EXPEDITION_TIER_BAND_META,
	type ExpeditionGuildTier,
	type ExpeditionTierBand,
	getExpeditionGradeTextClass,
	getExpeditionTierBand
} from '@/libs/expedition-guild-tier.constants'
import { formatLocaleNumber, formatPlacementRank } from '@/utils/format-korean-number'

/** 등급 구간 헤더를 끼워 넣어 한 덩어리로 보이지 않게 합니다. */
function buildTierRows(tiers: readonly ExpeditionGuildTier[]) {
	const rows: Array<{ type: 'band'; band: ExpeditionTierBand } | { type: 'tier'; tier: ExpeditionGuildTier }> = []
	let previousBand: ExpeditionTierBand | null = null

	for (const tier of tiers) {
		const band = getExpeditionTierBand(tier.rank)

		if (band === null) {
			continue
		}

		if (band !== previousBand) {
			rows.push({ type: 'band', band })
			previousBand = band
		}

		rows.push({ type: 'tier', tier })
	}

	return rows
}

function ExpeditionTierGuide() {
	const rows = buildTierRows(EXPEDITION_GUILD_TIERS)

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="토벌전 등급별 포인트"
					>
						<CircleHelpIcon className="size-4" />
						{/* 모바일은 짧은 라벨, md 이상에서 전체 문구 */}
						<span className="md:hidden">토벌 등급</span>
						<span className="hidden md:inline">토벌전 등급별 포인트</span>
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>토벌전 길드 포인트</DialogTitle>
					{/* DialogDescription 기본 태그는 <p>라서, 문단이 둘 이상이면 div로 렌더해야 hydration 오류가 없다 */}
					<DialogDescription render={<div />} className="space-y-1">
						<p>토벌전 순위와 점수에 따른 길드 포인트입니다.</p>
						<p>자격 등수 이내에 들어야 해당 포인트를 받을 수 있습니다.</p>
					</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 bg-card shadow-soft max-h-[60dvh] overflow-y-auto rounded-xl border sm:max-h-[65dvh]">
					<Table>
						<TableHeader className="bg-grayscale-100 sticky top-0 z-10">
							<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">등급</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									자격 등수
								</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									포인트
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => {
								if (row.type === 'band') {
									const { label, headerClassName } = EXPEDITION_TIER_BAND_META[row.band]

									return (
										<TableRow key={`band-${row.band}`} className="hover:bg-transparent">
											<TableCell
												colSpan={3}
												className={cn(
													'border-grayscale-200 px-3 py-1.5 text-[11px] font-semibold tracking-wide',
													headerClassName
												)}
											>
												{label}
											</TableCell>
										</TableRow>
									)
								}

								const { tier } = row

								return (
									<TableRow key={tier.rank} className="border-grayscale-100 hover:bg-grayscale-50/80">
										<TableCell className={cn('px-3 py-2.5', getExpeditionGradeTextClass(tier.rank))}>
											{tier.rank}
										</TableCell>
										<TableCell className="text-grayscale-600 px-3 py-2.5 tabular-nums">
											{formatPlacementRank(tier.maxPlacement)}
										</TableCell>
										<TableCell className="text-grayscale-900 px-3 py-2.5 font-semibold tabular-nums">
											{formatLocaleNumber(tier.points)}
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

export default ExpeditionTierGuide
