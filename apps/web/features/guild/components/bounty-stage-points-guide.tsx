'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { CircleHelpIcon } from 'lucide-react'

import {
	getGuildBountyStageEntries,
	GUILD_BOUNTY_STAGE_BANDS,
	type GuildBountyStageBand,
	type GuildBountyStageEntry
} from '@/features/tips/lib/guild-bounty.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

type BountyStagePointRow =
	{ type: 'band'; band: GuildBountyStageBand } | { type: 'stage'; entry: GuildBountyStageEntry }

/** 10단계 밴드 헤더를 끼워 표가 한 덩어리로 보이지 않게 합니다. */
function buildBountyStagePointRows(
	bands: readonly GuildBountyStageBand[],
	entries: readonly GuildBountyStageEntry[]
): BountyStagePointRow[] {
	const rows: BountyStagePointRow[] = []

	for (const band of bands) {
		rows.push({ type: 'band', band })

		for (const entry of entries) {
			if (entry.stage >= band.fromStage && entry.stage <= band.toStage) {
				rows.push({ type: 'stage', entry })
			}
		}
	}

	return rows
}

function formatBountyStageBandLabel(fromStage: number, toStage: number): string {
	return `${fromStage}~${toStage}단계`
}

/** 상위 단계일수록 따뜻한 톤 */
function getBountyStageBandClass(fromStage: number): string {
	if (fromStage >= 81) {
		return 'bg-pastel-red-50 text-pastel-red-800'
	}

	if (fromStage >= 61) {
		return 'bg-pastel-orange-50 text-pastel-orange-800'
	}

	if (fromStage >= 41) {
		return 'bg-pastel-green-50 text-pastel-green-800'
	}

	if (fromStage >= 21) {
		return 'bg-pastel-blue-50 text-pastel-blue-800'
	}

	return 'bg-pastel-purple-100 text-pastel-purple-600'
}

type BountyStagePointsGuideProps = {
	/** true면 lg 미만에서 '현상'으로 줄임 */
	compactMobileLabel?: boolean
}

function BountyStagePointsGuide({ compactMobileLabel = true }: BountyStagePointsGuideProps) {
	const entries = getGuildBountyStageEntries()
	const rows = buildBountyStagePointRows(GUILD_BOUNTY_STAGE_BANDS, entries)

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="현상수배 단계별 포인트"
					>
						<CircleHelpIcon className="size-4" />
						{compactMobileLabel ? (
							<>
								<span className="lg:hidden">현상수배</span>
								<span className="hidden lg:inline">현상수배 단계별 포인트</span>
							</>
						) : (
							<span>현상수배 단계별 포인트</span>
						)}
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>현상수배 단계별 포인트</DialogTitle>
					<DialogDescription render={<div />} className="space-y-1">
						<p>불꽃늑대를 처치하면 해당 단계의 클리어 점수가 누적됩니다.</p>
						<p>1단계부터 총 누적된 클리어 점수가 최종 사냥 실적으로 반영됩니다.</p>
					</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 bg-card shadow-soft max-h-[60dvh] overflow-y-auto rounded-xl border sm:max-h-[65dvh]">
					<Table containerClassName="overflow-visible">
						<TableHeader sticky className="[&>tr>th]:bg-grayscale-100">
							<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">단계</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									클리어 점수
								</TableHead>
								<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">
									누적 점수 (사냥 실적)
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => {
								if (row.type === 'band') {
									const { fromStage, toStage } = row.band

									return (
										<TableRow key={`band-${fromStage}-${toStage}`} className="hover:bg-transparent">
											<TableCell
												colSpan={3}
												className={cn(
													'border-grayscale-200 px-3 py-1.5 text-[11px] font-semibold tracking-wide',
													getBountyStageBandClass(fromStage)
												)}
											>
												{formatBountyStageBandLabel(fromStage, toStage)}
											</TableCell>
										</TableRow>
									)
								}

								const { stage, clearScore, huntingScore, isHardStage } = row.entry

								return (
									<TableRow key={stage} className="border-grayscale-100 hover:bg-grayscale-50/80">
										<TableCell
											className={cn(
												'px-3 py-2.5 font-semibold tabular-nums',
												isHardStage ? 'bg-red-100 text-red-900' : 'bg-grayscale-50 text-grayscale-800'
											)}
										>
											{stage}단계
										</TableCell>
										<TableCell
											className={cn(
												'px-3 py-2.5 tabular-nums',
												isHardStage ? 'bg-red-50 text-red-900' : 'text-grayscale-900'
											)}
										>
											{formatLocaleNumber(clearScore)}
										</TableCell>
										<TableCell
											className={cn(
												'px-3 py-2.5 tabular-nums',
												isHardStage ? 'bg-red-50 text-red-900' : 'text-grayscale-700'
											)}
										>
											{formatLocaleNumber(huntingScore)}
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

export default BountyStagePointsGuide
