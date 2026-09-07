'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Label } from '@shared/ui/label'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@shared/ui/popover'
import { Switch } from '@shared/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { InfoIcon } from 'lucide-react'
import Image from 'next/image'
import { type ReactNode, useState } from 'react'

import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	applyBossRaidBurningRates,
	BOSS_RAID_BOSS_META,
	BOSS_RAID_REWARD_GRADE_META,
	BOSS_RAID_REWARD_TIER_LABELS,
	formatBossRaidMilestoneRewardName,
	formatBossRaidRatePercent,
	formatBossRaidRewardName,
	getBossRaidBonusOptionCountRates,
	getBossRaidDifficultyLabel,
	getBossRaidEntry,
	getBossRaidEquipmentMaxLevel,
	getBossRaidMaterialQuantity,
	getBossRaidMilestoneEquipmentMaxLevel,
	partitionBossRaidRewards
} from '../../lib/boss-raid.constants'
import type {
	BossRaidBonusOptionCountRates,
	BossRaidEntry,
	BossRaidMilestone,
	BossRaidReward,
	BossRaidSelection
} from '../../types/boss-raid.type'

type BossRaidRewardTableProps = {
	selectedBoss: BossRaidSelection
}

const cellBaseClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-center text-xs font-semibold whitespace-normal tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

const itemCellClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-left text-xs whitespace-normal xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base border-r-grayscale-200 border-r'

const tableHeadClassName =
	'bg-grayscale-100 text-grayscale-600 min-w-0 overflow-hidden text-center text-xs leading-tight break-keep whitespace-normal md:text-sm border-r-grayscale-200 border-r'

function BossRaidRewardGradeBadge({ reward }: { reward: BossRaidReward | BossRaidMilestone }) {
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

/** 부가옵션 개수(0~4개) 확률 미니 표 */
function BossRaidBonusOptionCountTable({ rates }: { rates: BossRaidBonusOptionCountRates }) {
	return (
		<div className="border-grayscale-200 w-full min-w-0 overflow-hidden rounded-md border">
			<div className="bg-grayscale-100 text-grayscale-600 border-b-grayscale-200 grid grid-cols-5 border-b text-center text-[10px] font-medium md:text-xs">
				{rates.map((_, count) => (
					<span
						key={`bonus-option-head-${count}`}
						className={cn(count < rates.length - 1 && 'border-r-grayscale-200 border-r', 'px-0.5 py-1')}
					>
						{count}개
					</span>
				))}
			</div>
			<div className="grid grid-cols-5 text-center text-[10px] font-semibold tabular-nums md:text-xs">
				{rates.map((rate, count) => (
					<span
						key={`bonus-option-rate-${count}`}
						className={cn(
							count < rates.length - 1 && 'border-r-grayscale-200 border-r',
							'px-0.5 py-1',
							rate > 0 ? 'text-grayscale-900' : 'text-grayscale-400'
						)}
					>
						{rate > 0 ? `${rate}%` : '—'}
					</span>
				))}
			</div>
		</div>
	)
}

/** 부가옵션 확률 — 탭/클릭으로 열리므로 모바일에서도 사용 가능 */
function BossRaidBonusOptionCountPopover({ rates }: { rates: BossRaidBonusOptionCountRates }) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-grayscale-500 hover:text-grayscale-700 h-auto min-h-0 gap-0.5 px-0 py-0 text-[10px] font-medium hover:bg-transparent md:text-xs"
						aria-label="부가 옵션 개수 확률 보기"
					>
						부가 옵션 개수
						<InfoIcon className="size-3" />
					</Button>
				}
			/>
			<PopoverContent align="start" className="w-auto min-w-56 gap-2 p-3" collisionPadding={8}>
				<PopoverHeader>
					<PopoverTitle className="text-sm">부가 옵션 개수 확률</PopoverTitle>
				</PopoverHeader>
				<BossRaidBonusOptionCountTable rates={rates} />
			</PopoverContent>
		</Popover>
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

/** 장비 셀 공통 레이아웃: [이미지] 등급+이름 / 레벨·부가옵션 */
function BossRaidEquipmentItemLayout({
	imageSrc,
	name,
	gradeBadge,
	maxLevel,
	bonusOptionRates
}: {
	imageSrc: string
	name: string
	gradeBadge: ReactNode
	maxLevel?: string
	bonusOptionRates?: BossRaidBonusOptionCountRates
}) {
	const hasMeta = Boolean(maxLevel || bonusOptionRates)

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
			<div className="mt-0.5 flex min-w-0 flex-1 flex-col gap-0.5 md:mt-1">
				<div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
					{gradeBadge}
					<span className="text-grayscale-700 min-w-0 text-xs leading-snug font-medium break-keep md:text-sm">
						{name}
					</span>
				</div>
				{hasMeta ? (
					<div className="text-grayscale-500 flex min-w-0 flex-wrap items-center gap-x-1 text-[10px] md:text-xs">
						{maxLevel ? <span className="tabular-nums">~ Lv.{maxLevel}</span> : null}
						{maxLevel && bonusOptionRates ? <span aria-hidden>·</span> : null}
						{bonusOptionRates ? <BossRaidBonusOptionCountPopover rates={bonusOptionRates} /> : null}
					</div>
				) : null}
			</div>
		</div>
	)
}

function BossRaidPrimaryRewardItemCell({ reward }: { reward: BossRaidReward }) {
	const name = formatBossRaidRewardName(reward)
	const maxLevel = getBossRaidEquipmentMaxLevel(reward)
	const bonusOptionRates = reward.kind === 'equipment' ? getBossRaidBonusOptionCountRates(reward) : undefined

	return (
		<BossRaidEquipmentItemLayout
			imageSrc={reward.imageSrc}
			name={name}
			gradeBadge={<BossRaidRewardGradeBadge reward={reward} />}
			maxLevel={maxLevel}
			bonusOptionRates={bonusOptionRates}
		/>
	)
}

function BossRaidMilestoneRewardItemCell({ milestone }: { milestone: BossRaidMilestone }) {
	const name = formatBossRaidMilestoneRewardName(milestone)
	const maxLevel = getBossRaidMilestoneEquipmentMaxLevel(milestone)
	const bonusOptionRates = milestone.kind === 'equipment' ? getBossRaidBonusOptionCountRates(milestone) : undefined

	return (
		<BossRaidEquipmentItemLayout
			imageSrc={milestone.imageSrc}
			name={name}
			gradeBadge={<BossRaidRewardGradeBadge reward={milestone} />}
			maxLevel={maxLevel}
			bonusOptionRates={bonusOptionRates}
		/>
	)
}

function BossRaidRewardTableHeader({
	bossName,
	difficultyLabel,
	requiredHit,
	showBurningToggle,
	burningOn,
	onBurningChange
}: {
	bossName: string
	difficultyLabel: string
	requiredHit: number
	showBurningToggle: boolean
	burningOn: boolean
	onBurningChange: (checked: boolean) => void
}) {
	return (
		<CardHeader className="gap-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">
						{bossName} · {difficultyLabel}
					</CardTitle>
					<Badge variant="secondary" className="tabular-nums">
						필요 명중 : {formatLocaleNumber(requiredHit)}
					</Badge>
				</div>

				{showBurningToggle ? (
					<Label
						htmlFor="boss-raid-burning"
						className={cn(
							'gap-2 rounded-md border px-3 py-1.5 font-medium shadow-xs transition-colors',
							burningOn
								? 'border-warning-500/40 bg-warning-50 text-warning-700'
								: 'border-grayscale-200 bg-card text-grayscale-600'
						)}
					>
						<span className="text-sm tabular-nums">버닝 {burningOn ? 'ON' : 'OFF'}</span>
						<Switch
							id="boss-raid-burning"
							checked={burningOn}
							onCheckedChange={onBurningChange}
							aria-label="버닝 이벤트"
							className={cn(burningOn && 'data-checked:bg-warning')}
						/>
					</Label>
				) : null}
			</div>
		</CardHeader>
	)
}

function BossRaidProbabilityRewardTable({
	entry,
	burningOn
}: {
	entry: Extract<BossRaidEntry, { rewardMode: 'probability' }>
	burningOn: boolean
}) {
	const rewards = burningOn ? applyBossRaidBurningRates(entry.rewards) : entry.rewards
	const { primary, materials } = partitionBossRaidRewards(rewards)
	const rowCount = Math.max(primary.length, materials.length)

	return (
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
								<TableCell
									className={cn(
										cellBaseClassName,
										'text-center',
										burningOn ? 'text-warning-700' : 'text-grayscale-900'
									)}
								>
									{primaryReward ? formatBossRaidRatePercent(primaryReward.ratePercent) : null}
								</TableCell>
								<TableCell className={cn(itemCellClassName, 'border-l-grayscale-200 border-l align-middle')}>
									{materialReward ? <BossRaidRewardItemCell reward={materialReward} /> : null}
								</TableCell>
								<TableCell className={cn(cellBaseClassName, 'text-grayscale-900 text-center')}>
									{materialReward ? formatBossRaidRatePercent(materialReward.ratePercent) : null}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

function BossRaidMilestoneRewardTable({ milestones }: { milestones: readonly BossRaidMilestone[] }) {
	return (
		<div className="border-grayscale-200 overflow-auto rounded-lg border">
			<Table className="w-full table-fixed" containerClassName="overflow-visible">
				<TableHeader>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className={cn(tableHeadClassName, 'border-r-grayscale-200 w-1/5 border-r')}>체력</TableHead>
						<TableHead className={cn(tableHeadClassName, 'border-r-0')}>보상</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{milestones.map((milestone) => (
						<TableRow key={milestone.hpPercent} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(cellBaseClassName, 'text-grayscale-900 align-middle')}>
								{milestone.hpPercent}%
							</TableCell>
							<TableCell className={cn(itemCellClassName, 'border-l-grayscale-200 border-l align-middle')}>
								<BossRaidMilestoneRewardItemCell milestone={milestone} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

function BossRaidRewardTable({ selectedBoss }: BossRaidRewardTableProps) {
	const [burningOn, setBurningOn] = useState(false)
	const { boss, difficulty } = selectedBoss
	const bossName = BOSS_RAID_BOSS_META[boss].label
	const difficultyLabel = getBossRaidDifficultyLabel(difficulty)

	const bossRaidEntry = getBossRaidEntry(boss, difficulty)

	if (!bossRaidEntry) {
		return null
	}

	const { requiredHit, rewardMode } = bossRaidEntry
	const isMilestone = rewardMode === 'milestone'

	return (
		<div className="flex flex-col gap-2 md:gap-4">
			<div className="flex flex-col gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">보상 상세</h2>
				<p className="text-grayscale-600 text-sm">
					{isMilestone
						? '길드레이드는 보스 체력을 깎은 퍼센트에 따라 확정적으로 보상이 지급됩니다.'
						: '장비·주문서는 희귀도 순, 재화·재료는 확률 높은 순으로 정렬했습니다.'}
				</p>
			</div>

			<Card className="border-grayscale-200 shadow-soft">
				<BossRaidRewardTableHeader
					bossName={bossName}
					difficultyLabel={difficultyLabel}
					requiredHit={requiredHit}
					showBurningToggle={!isMilestone}
					burningOn={burningOn}
					onBurningChange={setBurningOn}
				/>
				<CardContent>
					{isMilestone ? (
						<BossRaidMilestoneRewardTable milestones={bossRaidEntry.milestones} />
					) : (
						<BossRaidProbabilityRewardTable entry={bossRaidEntry} burningOn={burningOn} />
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default BossRaidRewardTable
