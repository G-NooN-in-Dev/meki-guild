import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	BOSS_RAID_BOSS_META,
	BOSS_RAID_REWARD_GRADE_META,
	BOSS_RAID_REWARD_TIER_LABELS,
	formatBossRaidRewardName,
	getBossRaidDifficultyLabel,
	getBossRaidEntry,
	getBossRaidEquipmentMaxLevel,
	getBossRaidMaterialQuantity,
	partitionBossRaidRewards
} from '../lib/boss-raid.constants'
import { BossRaidReward, BossRaidSelection } from '../types/boss-raid.type'

type BossRaidRewardTableProps = {
	selectedBoss: BossRaidSelection
}

const cellBaseClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-center text-xs font-semibold whitespace-normal tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

const itemCellClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-left text-xs whitespace-normal xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base border-r-grayscale-200 border-r'

const tableHeadClassName =
	'bg-grayscale-100 text-grayscale-600 min-w-0 overflow-hidden text-center text-xs leading-tight break-keep whitespace-normal md:text-sm border-r-grayscale-200 border-r'

function BossRaidRewardGradeBadge({ reward }: { reward: BossRaidReward }) {
	if (reward.kind !== 'equipment') {
		return null
	}

	const { grade, tier } = reward
	const { label, badgeClassName } = BOSS_RAID_REWARD_GRADE_META[grade]

	return (
		<Badge className={cn('shrink-0 px-1.5 py-0 text-[10px] font-medium md:text-xs', badgeClassName)}>
			{label} ({BOSS_RAID_REWARD_TIER_LABELS[tier]})
		</Badge>
	)
}

function BossRaidRewardItemCell({ reward }: { reward: BossRaidReward }) {
	const name = formatBossRaidRewardName(reward)
	const quantity = getBossRaidMaterialQuantity(reward)

	return (
		<span className="flex min-w-0 items-start gap-1.5 sm:gap-2">
			<Image
				src={reward.imageSrc}
				alt={name}
				width={64}
				height={64}
				unoptimized
				draggable={false}
				className="bg-card border-grayscale-200 size-8 shrink-0 rounded-md border object-contain md:size-9"
			/>
			<span className="min-w-0 flex-1">
				<span className="text-grayscale-900 block truncate text-xs font-medium md:text-sm">{name}</span>
				{quantity ? (
					<span className="text-grayscale-500 block text-[10px] tabular-nums md:text-xs">{quantity}</span>
				) : null}
			</span>
		</span>
	)
}

function BossRaidPrimaryRewardItemCell({ reward }: { reward: BossRaidReward }) {
	const { imageSrc } = reward
	const name = formatBossRaidRewardName(reward)
	const maxLevel = getBossRaidEquipmentMaxLevel(reward)

	return (
		<div className="flex min-w-0 items-start gap-1.5 sm:gap-2">
			<Image
				src={imageSrc}
				alt={name}
				width={64}
				height={64}
				unoptimized
				draggable={false}
				className="bg-card border-grayscale-200 size-8 shrink-0 rounded-md border object-contain md:size-9"
			/>
			<span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:flex-wrap md:items-center md:gap-x-1.5 md:gap-y-0.5">
				<BossRaidRewardGradeBadge reward={reward} />
				<span className="text-grayscale-700 min-w-0 text-xs leading-snug font-medium break-keep md:flex-1 md:text-sm">
					{name}
				</span>
				{maxLevel ? (
					<span className="text-grayscale-500 text-[10px] tabular-nums md:text-xs">(~ Lv.{maxLevel})</span>
				) : null}
			</span>
		</div>
	)
}

function BossRaidRewardTable({ selectedBoss }: BossRaidRewardTableProps) {
	const { boss, difficulty } = selectedBoss
	const bossName = BOSS_RAID_BOSS_META[boss].label
	const difficultyLabel = getBossRaidDifficultyLabel(difficulty)

	const bossRaidEntry = getBossRaidEntry(boss, difficulty)

	if (!bossRaidEntry) {
		return null
	}

	const { requiredHit, rewards } = bossRaidEntry
	const { primary, materials } = partitionBossRaidRewards(rewards)
	const rowCount = Math.max(primary.length, materials.length)

	return (
		<div className="flex flex-col gap-2 md:gap-4">
			<div className="flex flex-col gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">보상 상세</h2>
				<p className="text-grayscale-600 text-sm">
					장비·주문서는 희귀도 순, 재화·재료는 확률 높은 순으로 정렬했습니다.
				</p>
			</div>

			<Card className="border-grayscale-200 shadow-soft">
				<CardHeader className="gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">
							{bossName} · {difficultyLabel}
						</CardTitle>
						<Badge variant="secondary" className="tabular-nums">
							필요 명중 : {formatLocaleNumber(requiredHit)}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="border-grayscale-200 overflow-auto rounded-lg border">
						<Table className="w-full table-fixed" containerClassName="overflow-visible">
							<TableHeader>
								<TableRow className="border-grayscale-200 hover:bg-transparent">
									<TableHead className={cn(tableHeadClassName, 'w-[38%]')}>장비/주문서</TableHead>
									<TableHead className={cn(tableHeadClassName, 'w-[12%]')}>확률</TableHead>
									<TableHead className={cn(tableHeadClassName, 'w-[38%]')}>기타 재화</TableHead>
									<TableHead className={cn(tableHeadClassName, 'w-[12%]')}>확률</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: rowCount }, (_, index) => {
									const primaryReward = primary[index]
									const materialReward = materials[index]

									return (
										<TableRow key={index} className="border-grayscale-200 hover:bg-transparent">
											<TableCell className={cn(itemCellClassName, 'align-middle')}>
												{primaryReward ? <BossRaidPrimaryRewardItemCell reward={primaryReward} /> : null}
											</TableCell>
											<TableCell className={cn(cellBaseClassName, 'text-grayscale-900 text-center')}>
												{primaryReward ? `${primaryReward.ratePercent}%` : null}
											</TableCell>
											<TableCell className={cn(itemCellClassName, 'border-l-grayscale-200 border-l align-middle')}>
												{materialReward ? <BossRaidRewardItemCell reward={materialReward} /> : null}
											</TableCell>
											<TableCell className={cn(cellBaseClassName, 'text-grayscale-900 text-center')}>
												{materialReward ? `${materialReward.ratePercent}%` : null}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default BossRaidRewardTable
