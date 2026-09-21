'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { getPredictGuildRowClass } from '@/features/tips/lib/guild-rank-predict.constants'
import type { RivalryPredictGuildRow } from '@/features/tips/types/guild-rivalry-rank-predict.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

type RivalryPredictGuildTableProps = {
	rows: readonly RivalryPredictGuildRow[]
}

/** 길드 대항전 예측 순위 표 */
function RivalryPredictGuildTable({ rows }: RivalryPredictGuildTableProps) {
	return (
		<div className="border-grayscale-200 overflow-hidden rounded-xl border">
			<Table className="w-full">
				<TableHeader>
					<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
						<TableHead className="w-14 text-center">순위</TableHead>
						<TableHead>길드명</TableHead>
						<TableHead className="pr-4 text-right">포인트 총합</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => {
						const { guildIndex, guildName, rank, serverLabel, totalPoints } = row

						return (
							<TableRow key={guildName} className={cn(getPredictGuildRowClass(guildIndex, rows.length))}>
								<TableCell className="text-center font-semibold tabular-nums">{formatLocaleNumber(rank)}</TableCell>
								<TableCell>
									<span className="font-semibold">{guildName}</span>
									{serverLabel ? (
										<span className="text-grayscale-500 ml-1.5 text-xs font-medium">{serverLabel}</span>
									) : null}
								</TableCell>
								<TableCell className="pr-4 text-right font-semibold tabular-nums">
									{formatLocaleNumber(totalPoints)}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default RivalryPredictGuildTable
