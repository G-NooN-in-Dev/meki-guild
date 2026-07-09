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
						토벌 등급 기준
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>토벌전 길드 등급 · 포인트 기준</DialogTitle>
					<DialogDescription>토벌전 점수 순위에 따라 부여되는 등급과 포인트입니다.</DialogDescription>
				</DialogHeader>
				<div className="border-grayscale-200 max-h-80 overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
								<TableHead className="text-grayscale-500 w-16">순위</TableHead>
								<TableHead className="text-grayscale-500">등급</TableHead>
								<TableHead className="text-grayscale-500 text-right">포인트</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{EXPEDITION_GUILD_TIERS.map((tier) => (
								<TableRow key={tier.position}>
									<TableCell className="text-grayscale-500">{tier.position}위</TableCell>
									<TableCell className="font-medium">{tier.rank}</TableCell>
									<TableCell className="text-right">{tier.points.toLocaleString('ko-KR')}</TableCell>
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
