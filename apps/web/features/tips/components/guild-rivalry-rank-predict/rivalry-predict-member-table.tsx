'use client'

import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'

import { getRivalryPredictGuildRowClass } from '@/features/tips/lib/guild-rivalry-rank-predict.constants'
import type { RivalryPredictMemberRow } from '@/features/tips/types/guild-rivalry-rank-predict.type'
import { getRivalryRankPointTextClass } from '@/libs/rivalry-rank-points.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

import PredictMemberPortrait from './predict-member-portrait'

type RivalryPredictMemberTableProps = {
	rows: readonly RivalryPredictMemberRow[]
}

/** 대항전 참가 길드원 전투력 순위 표 */
function RivalryPredictMemberTable({ rows }: RivalryPredictMemberTableProps) {
	return (
		<div className="border-grayscale-200 overflow-hidden rounded-xl border">
			<Table className="w-full table-fixed">
				<TableHeader>
					<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
						<TableHead className="w-10 text-center">순위</TableHead>
						<TableHead>길드원</TableHead>
						<TableHead>전투력</TableHead>
						<TableHead className="pr-2 text-right lg:pr-4">대항전 포인트</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => {
						const { combatPowerLabel, guildIndex, guildName, job, level, name, points, portraitUrl, rank } = row

						return (
							<TableRow key={`${guildName}-${name}-${rank}`} className={cn(getRivalryPredictGuildRowClass(guildIndex))}>
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
								<TableCell
									className={cn(
										'pr-2 text-right text-sm whitespace-nowrap tabular-nums lg:pr-4',
										getRivalryRankPointTextClass(rank)
									)}
								>
									{formatLocaleNumber(points)}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default RivalryPredictMemberTable
