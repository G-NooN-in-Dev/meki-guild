'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { getTrainingPredictGuildRowClass } from '@/features/tips/lib/guild-training-rank-predict.constants'
import type { TrainingPredictGuildRow } from '@/features/tips/types/guild-training-rank-predict.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

type TrainingPredictGuildTableProps = {
	rows: readonly TrainingPredictGuildRow[]
}

/** 길드 수련장 예측 순위 표 */
function TrainingPredictGuildTable({ rows }: TrainingPredictGuildTableProps) {
	return (
		<div className="border-grayscale-200 overflow-hidden rounded-xl border">
			<Table className="w-full">
				<TableHeader>
					<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
						<TableHead className="w-14 text-center">순위</TableHead>
						<TableHead>길드명</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map((row) => {
						const { guildIndex, guildName, rank, serverLabel } = row

						return (
							<TableRow key={guildName} className={cn(getTrainingPredictGuildRowClass(guildIndex))}>
								<TableCell className="text-center font-semibold tabular-nums">{formatLocaleNumber(rank)}</TableCell>
								<TableCell>
									<span className="font-semibold">{guildName}</span>
									{serverLabel ? (
										<span className="text-grayscale-500 ml-1.5 text-xs font-medium">{serverLabel}</span>
									) : null}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default TrainingPredictGuildTable
