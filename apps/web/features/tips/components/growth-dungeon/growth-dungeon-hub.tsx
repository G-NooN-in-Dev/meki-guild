'use client'

import { Badge } from '@shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { useState } from 'react'

import {
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
	title: string
	tags: readonly string[]
}

function GrowthDungeonHub({ title, tags }: GrowthDungeonHubProps) {
	const [activeTab, setActiveTab] = useState<GrowthDungeonTabValue>('weapon')

	return (
		<div className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<header className="flex flex-col gap-2">
				<div className="flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{title}</h1>
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
					{GROWTH_DUNGEON_TABS.map((tab) => {
						const { label, shortLabel, value } = tab
						return (
							<TabsTrigger key={value} value={value} aria-label={label} className="px-1 md:px-2">
								<span className="md:hidden">{shortLabel}</span>
								<span className="hidden md:inline">{label}</span>
							</TabsTrigger>
						)
					})}
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
