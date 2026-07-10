'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { CircleHelpIcon } from 'lucide-react'

import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'

function ExpeditionTierGuide() {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-600 gap-1.5">
						<CircleHelpIcon className="size-4" />
						토벌전 등급별 포인트
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>토벌전 길드 포인트</DialogTitle>
					<DialogDescription>토벌전 순위와 점수에 따른 길드 포인트입니다.</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 max-h-80 overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
								<TableHead className="text-grayscale-500 text-center">등급</TableHead>
								<TableHead className="text-grayscale-500 text-center">포인트</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{EXPEDITION_GUILD_TIERS.map((tier) => (
								<TableRow key={tier.rank}>
									<TableCell className="text-center font-medium">{tier.rank}</TableCell>
									<TableCell className="text-grayscale-900 text-center font-semibold">
										{tier.points.toLocaleString('ko-KR')}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ExpeditionTierGuide
