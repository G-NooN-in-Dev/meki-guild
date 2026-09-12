'use client'

import { Badge } from '@shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { useState } from 'react'

import MonsterPortrait from '@/features/tips/components/shared/monster-portrait'

import {
	GROWTH_DUNGEON_MONSTER_SRC,
	GROWTH_DUNGEON_TABS,
	type GrowthDungeonTabValue,
	isGrowthDungeonTabValue
} from '../../lib/growth-dungeon.constants'
import AbilityDungeonBoard from './ability-dungeon-board'
import EnhanceDungeonBoard from './enhance-dungeon-board'
import EquipmentDungeonBoard from './equipment-dungeon-board'
import ExperienceDungeonBoard from './experience-dungeon-board'
import WeaponDungeonBoard from './weapon-dungeon-board'

type GrowthDungeonHubProps = {
	tags: readonly string[]
}

function GrowthDungeonHub({ tags }: GrowthDungeonHubProps) {
	const [activeTab, setActiveTab] = useState<GrowthDungeonTabValue>('weapon')
	const activeLabel = GROWTH_DUNGEON_TABS.find((tab) => tab.value === activeTab)?.label ?? '무기 던전'

	return (
		<div className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<header className="flex items-center justify-between gap-4">
				<div className="flex min-w-0 flex-col gap-2">
					<div className="flex flex-wrap gap-1.5">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">성장 던전 정보</h1>
				</div>

				<MonsterPortrait
					src={GROWTH_DUNGEON_MONSTER_SRC[activeTab]}
					alt={activeLabel}
					size="lg"
					className="size-20 md:size-24"
				/>
			</header>

			<Tabs
				value={activeTab}
				onValueChange={(value) => {
					if (isGrowthDungeonTabValue(value)) {
						setActiveTab(value)
					}
				}}
				className="gap-4"
			>
				<TabsList className="grid w-full max-w-md grid-cols-5">
					{GROWTH_DUNGEON_TABS.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="weapon">
					<WeaponDungeonBoard />
				</TabsContent>

				<TabsContent value="experience">
					<ExperienceDungeonBoard />
				</TabsContent>

				<TabsContent value="equipment">
					<EquipmentDungeonBoard />
				</TabsContent>

				<TabsContent value="ability">
					<AbilityDungeonBoard />
				</TabsContent>

				<TabsContent value="enhance">
					<EnhanceDungeonBoard />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default GrowthDungeonHub
