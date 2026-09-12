'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { Label } from '@shared/ui/label'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@shared/ui/popover'
import { Switch } from '@shared/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { InfoIcon, LockIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import MonsterPortrait from '@/features/tips/components/shared/monster-portrait'
import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	applyPartyQuestBurningRates,
	formatPartyQuestRatePercent,
	getPartyQuestDifficultyLabel,
	getPartyQuestEntry,
	getPartyQuestEquipmentMaxLevel,
	getPartyQuestMaterialQuantity,
	PARTY_QUEST_BONUS_OPTION_COUNT_RATES,
	PARTY_QUEST_META,
	PARTY_QUEST_REWARD_GRADE_META,
	PARTY_QUEST_REWARD_TIER_LABELS,
	sortPartyQuestMaterials
} from '../../lib/party-quest.constants'
import type {
	PartyQuestBonusOptionCountRates,
	PartyQuestEntry,
	PartyQuestEquipmentReward,
	PartyQuestMaterialReward,
	PartyQuestSelection
} from '../../types/party-quest.type'

type PartyQuestRewardTableProps = {
	selectedQuest: PartyQuestSelection
}

const cellBaseClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-center text-xs font-semibold whitespace-normal tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

const itemCellClassName =
	'min-w-0 overflow-hidden px-1.5 py-2 text-left text-xs whitespace-normal xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base border-r-grayscale-200 border-r'

const tableHeadClassName =
	'bg-grayscale-100 text-grayscale-600 min-w-0 overflow-hidden text-center text-xs leading-tight break-keep whitespace-normal md:text-sm border-r-grayscale-200 border-r'

function PartyQuestRewardGradeBadge({ equipment }: { equipment: PartyQuestEquipmentReward }) {
	const { grade, tier } = equipment
	const { label, badgeClassName } = PARTY_QUEST_REWARD_GRADE_META[grade]

	return (
		<Badge className={cn('shrink-0 px-1 py-0 text-[10px] font-medium md:px-1.5 md:text-xs', badgeClassName)}>
			{label} ({PARTY_QUEST_REWARD_TIER_LABELS[tier]})
		</Badge>
	)
}

function PartyQuestBonusOptionCountTable({ rates }: { rates: PartyQuestBonusOptionCountRates }) {
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

function PartyQuestBonusOptionCountPopover({ rates }: { rates: PartyQuestBonusOptionCountRates }) {
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
				<PartyQuestBonusOptionCountTable rates={rates} />
			</PopoverContent>
		</Popover>
	)
}

function PartyQuestMaterialItemCell({ material }: { material: PartyQuestMaterialReward }) {
	const quantity = getPartyQuestMaterialQuantity(material)
	const { imageSrc, name } = material

	return (
		<span className="flex min-w-0 items-start gap-1.5 sm:gap-2">
			<Image
				src={imageSrc}
				alt={name}
				width={64}
				height={64}
				unoptimized
				draggable={false}
				className="bg-card border-grayscale-200 size-8 shrink-0 rounded-md border object-contain md:size-9"
			/>
			<span className="min-w-0 flex-1">
				<span className="text-grayscale-900 block truncate text-xs font-medium md:text-sm">{name}</span>
				<span className="text-grayscale-500 block text-[10px] tabular-nums md:text-xs">{quantity}</span>
			</span>
		</span>
	)
}

function PartyQuestEquipmentItemCell({ equipment }: { equipment: PartyQuestEquipmentReward }) {
	const maxLevel = getPartyQuestEquipmentMaxLevel(equipment)
	const { imageSrc, name } = equipment
	return (
		<div className="flex min-w-0 flex-col gap-0.5">
			<PartyQuestRewardGradeBadge equipment={equipment} />
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
					<span className="text-grayscale-700 min-w-0 text-xs leading-snug font-medium break-keep md:text-sm">
						{name}
					</span>
					<div className="text-grayscale-500 flex min-w-0 flex-wrap items-center gap-x-1 text-[10px] md:text-xs">
						<span className="tabular-nums">~ Lv.{maxLevel}</span>
						<span aria-hidden>·</span>
						<PartyQuestBonusOptionCountPopover rates={PARTY_QUEST_BONUS_OPTION_COUNT_RATES} />
					</div>
				</div>
			</div>
		</div>
	)
}

function PartyQuestRewardTableHeader({
	questName,
	questImageSrc,
	difficultyLabel,
	requiredHit,
	burningOn,
	onBurningChange
}: {
	questName: string
	questImageSrc: string
	difficultyLabel: string
	requiredHit: number
	burningOn: boolean
	onBurningChange: (checked: boolean) => void
}) {
	return (
		<CardHeader className="gap-2">
			<div className="flex items-start justify-between gap-2">
				<div className="flex min-w-0 items-start gap-2">
					<MonsterPortrait src={questImageSrc} alt={questName} size="sm" />
					<div className="flex min-w-0 flex-col gap-1">
						<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">
							{questName} · {difficultyLabel}
						</CardTitle>
						<Badge variant="secondary" className="w-fit tabular-nums">
							필요 명중 : {formatLocaleNumber(requiredHit)}
						</Badge>
					</div>
				</div>

				<Label
					htmlFor="party-quest-burning"
					className={cn(
						'shrink-0 gap-2 rounded-md border px-3 py-1.5 font-medium shadow-xs transition-colors',
						burningOn
							? 'border-warning-500/40 bg-warning-50 text-warning-700'
							: 'border-grayscale-200 bg-card text-grayscale-600'
					)}
				>
					<span className="text-sm tabular-nums">버닝 {burningOn ? 'ON' : 'OFF'}</span>
					<Switch
						id="party-quest-burning"
						checked={burningOn}
						onCheckedChange={onBurningChange}
						aria-label="버닝 이벤트"
						className={cn(burningOn && 'data-checked:bg-warning')}
					/>
				</Label>
			</div>
		</CardHeader>
	)
}

function PartyQuestProbabilityRewardTable({ entry, burningOn }: { entry: PartyQuestEntry; burningOn: boolean }) {
	const { equipmentRate, materials: adjustedMaterials } = applyPartyQuestBurningRates(
		entry.difficulty,
		entry.materials,
		burningOn
	)
	const materials = sortPartyQuestMaterials(adjustedMaterials)

	return (
		<div className="border-grayscale-200 overflow-auto rounded-lg border">
			<Table className="w-full table-fixed" containerClassName="overflow-visible">
				<TableHeader>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className={cn(tableHeadClassName, 'w-[78%] border-r-0 md:w-[82%]')}>보상</TableHead>
						<TableHead className={cn(tableHeadClassName, 'w-[22%] border-r-0 md:w-[18%]')}>확률</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(itemCellClassName, 'border-r-0 align-middle')}>
							<PartyQuestEquipmentItemCell equipment={entry.equipment} />
						</TableCell>
						<TableCell
							className={cn(cellBaseClassName, 'text-center', burningOn ? 'text-warning-700' : 'text-grayscale-900')}
						>
							{formatPartyQuestRatePercent(equipmentRate)}
						</TableCell>
					</TableRow>
					{materials.map((material) => (
						<TableRow key={material.name} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(itemCellClassName, 'border-r-0 align-middle')}>
								<PartyQuestMaterialItemCell material={material} />
							</TableCell>
							<TableCell className={cn(cellBaseClassName, 'text-grayscale-900 text-center')}>
								{formatPartyQuestRatePercent(material.ratePercent)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

function PartyQuestLockedDifficultyEmpty({
	questName,
	difficultyLabel
}: {
	questName: string
	difficultyLabel: string
}) {
	return (
		<Empty className="border-grayscale-200 bg-card/50 shadow-soft border border-dashed py-10 md:py-12">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<LockIcon />
				</EmptyMedia>
				<EmptyTitle className="text-base md:text-lg">
					{questName} · {difficultyLabel}
				</EmptyTitle>
				<EmptyDescription>아직 해금되지 않은 난이도입니다. 해금되면 보상 정보를 확인할 수 있습니다.</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}

function PartyQuestRewardTable({ selectedQuest }: PartyQuestRewardTableProps) {
	const [burningOn, setBurningOn] = useState(false)
	const { quest, difficulty } = selectedQuest
	const { label: questName, imageSrc: questImageSrc } = PARTY_QUEST_META[quest]
	const difficultyLabel = getPartyQuestDifficultyLabel(difficulty)
	const entry = getPartyQuestEntry(quest, difficulty)

	if (!entry) {
		return (
			<div className="flex flex-col gap-2 md:gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">보상 상세</h2>
					<p className="text-grayscale-600 text-sm">선택한 파티퀘스트·난이도의 보상 정보를 확인할 수 있습니다.</p>
				</div>
				<PartyQuestLockedDifficultyEmpty questName={questName} difficultyLabel={difficultyLabel} />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2 md:gap-4">
			<div className="flex flex-col gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">보상 상세</h2>
				<p className="text-grayscale-600 text-sm">장비를 제외한 재화·재료는 확률 높은 순으로 정렬했습니다.</p>
			</div>

			<Card className="border-grayscale-200 shadow-soft">
				<PartyQuestRewardTableHeader
					questName={questName}
					questImageSrc={questImageSrc}
					difficultyLabel={difficultyLabel}
					requiredHit={entry.requiredHit}
					burningOn={burningOn}
					onBurningChange={setBurningOn}
				/>
				<CardContent>
					<PartyQuestProbabilityRewardTable entry={entry} burningOn={burningOn} />
				</CardContent>
			</Card>
		</div>
	)
}

export default PartyQuestRewardTable
