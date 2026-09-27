'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { CircleHelpIcon } from 'lucide-react'

import {
	CONTENT_TIER_BAND_META,
	type ContentTierBand,
	getContentGradeTextClass,
	getContentTierBand
} from '@/libs/content-tier-band.constants'
import { WORLD_BOSS_TIERS, type WorldBossTier } from '@/libs/world-boss-tier.constants'
import { formatKoreanNumber, formatPlacementRank } from '@/utils/format-korean-number'

/** 등급 구간 헤더를 끼워 넣어 한 덩어리로 보이지 않게 합니다. */
function buildTierRows(tiers: readonly WorldBossTier[]) {
	const rows: Array<{ type: 'band'; band: ContentTierBand } | { type: 'tier'; tier: WorldBossTier }> = []
	let previousBand: ContentTierBand | null = null

	for (const tier of tiers) {
		const band = getContentTierBand(tier.rank)

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

type WorldBossTierGuideProps = {
	/** true면 lg 미만에서 '월드'로 줄임. 툴바 기본값, 캐릭터 비교 등은 false */
	compactMobileLabel?: boolean
}

function WorldBossTierGuide({ compactMobileLabel = true }: WorldBossTierGuideProps) {
	const rows = buildTierRows(WORLD_BOSS_TIERS)

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="월드보스 등급 정보"
					>
						<CircleHelpIcon className="size-4" />
						{compactMobileLabel ? (
							<>
								{/* 태블릿 이하는 짧은 라벨, lg 이상에서 전체 문구 */}
								<span className="lg:hidden">월드</span>
								<span className="hidden lg:inline">월드보스 등급 정보</span>
							</>
						) : (
							<span>월드보스 등급 정보</span>
						)}
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>월드보스 등급</DialogTitle>
					{/* DialogDescription 기본 태그는 <p>라서, 문단이 둘 이상이면 div로 렌더해야 hydration 오류가 없다 */}
					<DialogDescription render={<div />} className="space-y-1">
						<p>월드보스 등수·최소 점수에 따른 등급입니다.</p>
						<p>자격 등수와 최소 점수를 모두 만족해야 해당 등급을 받을 수 있습니다.</p>
					</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 bg-card shadow-soft max-h-[60dvh] overflow-y-auto rounded-xl border sm:max-h-[65dvh]">
					<Table containerClassName="overflow-visible">
						<TableHeader sticky className="[&>tr>th]:bg-grayscale-100">
							<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">등급</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									자격 등수
								</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									최소 점수
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => {
								if (row.type === 'band') {
									const { label, headerClassName } = CONTENT_TIER_BAND_META[row.band]

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
										<TableCell className={cn('px-3 py-2.5', getContentGradeTextClass(tier.rank))}>
											{tier.rank}
										</TableCell>
										<TableCell className="text-grayscale-600 px-3 py-2.5 tabular-nums">
											{formatPlacementRank(tier.maxPlacement)}
										</TableCell>
										<TableCell className="text-grayscale-900 px-3 py-2.5 font-semibold tabular-nums">
											{formatKoreanNumber(BigInt(tier.minScore))}
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

export default WorldBossTierGuide
