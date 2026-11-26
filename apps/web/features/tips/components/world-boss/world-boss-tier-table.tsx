'use client'

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	HIT_CUT_CELL_BASE_CLASS_NAME,
	HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
	HitCutTableShell
} from '@/features/tips/components/shared/hit-cut-table-shell'
import TipsReferenceDisclosure from '@/features/tips/components/shared/tips-reference-disclosure'
import {
	CONTENT_TIER_BAND_META,
	type ContentTierBand,
	getContentGradeTextClass,
	getContentTierBand
} from '@/libs/content-tier-band.constants'
import { WORLD_BOSS_TIERS, type WorldBossTier } from '@/libs/world-boss-tier.constants'
import { formatKoreanNumber, formatPlacementRank } from '@/utils/format-korean-number'

type TierRow = { type: 'band'; band: ContentTierBand } | { type: 'tier'; tier: WorldBossTier }

/** 등급 구간 헤더를 끼워 넣어 한 덩어리로 보이지 않게 합니다. */
function buildTierRows(tiers: readonly WorldBossTier[]): TierRow[] {
	const rows: TierRow[] = []
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

const HEAD_CLASS_NAME = cn(
	HIT_CUT_NEUTRAL_HEAD_CLASS_NAME,
	'h-auto px-1.5 py-2 text-center text-xs leading-tight xs:px-2 md:px-3 md:text-sm'
)

function TierTableBody({ rows }: { rows: readonly TierRow[] }) {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, 'w-[34%]')}>등급</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'w-[33%]')}>자격 등수</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'w-[33%]')}>최소 점수</TableHead>
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
										'border-grayscale-200 px-3 py-1.5 text-left text-[11px] font-semibold tracking-wide',
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
						<TableRow key={tier.rank} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, getContentGradeTextClass(tier.rank))}>
								{tier.rank}
							</TableCell>
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'text-grayscale-600 font-normal')}>
								{formatPlacementRank(tier.maxPlacement)}
							</TableCell>
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'text-grayscale-900')}>
								{formatKoreanNumber(BigInt(tier.minScore))}
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</HitCutTableShell>
	)
}

/**
 * 월드보스 등급별 자격 등수·최소 점수 표.
 * lg+ Collapsible / 모바일 Dialog.
 */
function WorldBossTierTable() {
	const rows = buildTierRows(WORLD_BOSS_TIERS)

	return (
		<TipsReferenceDisclosure
			title="등급 정보"
			description="자격 등수와 최소 점수를 모두 만족해야 해당 등급을 받을 수 있습니다."
		>
			<TierTableBody rows={rows} />
		</TipsReferenceDisclosure>
	)
}

export default WorldBossTierTable
