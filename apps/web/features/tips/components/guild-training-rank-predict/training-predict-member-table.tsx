'use client'

import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'

import PredictMemberPortrait from '@/features/tips/components/guild-rank-predict/predict-member-portrait'
import { getPredictGuildRowClass } from '@/features/tips/lib/guild-rank-predict.constants'
import type { TrainingPredictMemberRow } from '@/features/tips/types/guild-training-rank-predict.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

type TrainingPredictMemberTableProps = {
	rows: readonly TrainingPredictMemberRow[]
}

/** 수련장 참가 길드원 전투력 순위 표 */
function TrainingPredictMemberTable({ rows }: TrainingPredictMemberTableProps) {
	const guildCount = new Set(rows.map((row) => row.guildIndex)).size

	return (
		<div className="border-grayscale-200 overflow-hidden rounded-xl border">
			<Table className="w-full table-fixed">
				<TableHeader>
					<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
						<TableHead className="w-10 text-center">순위</TableHead>
						<TableHead>길드원</TableHead>
						<TableHead>전투력</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => {
						const { combatPowerLabel, guildIndex, guildName, job, level, name, portraitUrl, rank } = row

						return (
							<TableRow
								key={`${guildName}-${name}-${rank}`}
								className={cn(getPredictGuildRowClass(guildIndex, guildCount))}
							>
								<TableCell className="text-center font-semibold tabular-nums">{formatLocaleNumber(rank)}</TableCell>
								<TableCell>
									<div className="flex min-w-0 items-center gap-2.5">
										<PredictMemberPortrait name={name} src={portraitUrl} />
										<div className="min-w-0">
											<p className="truncate text-sm">
												<span className="text-grayscale-900 font-semibold">{name}</span>
												<span className="text-grayscale-300 mx-1">|</span>
												<span className="text-grayscale-600">{guildName}</span>
											</p>
											<p className="text-grayscale-500 truncate text-xs">
												{job}
												<span className="text-grayscale-300 mx-1">|</span>
												Lv.{formatLocaleNumber(level)}
											</p>
										</div>
									</div>
								</TableCell>
								<TableCell className="truncate text-sm font-semibold whitespace-nowrap tabular-nums">
									{combatPowerLabel}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default TrainingPredictMemberTable
