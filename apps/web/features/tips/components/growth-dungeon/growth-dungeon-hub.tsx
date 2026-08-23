'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

import { GROWTH_DUNGEON_TABS } from '../../lib/growth-dungeon.constants'
import EquipmentDungeonBoard from './equipment-dungeon-board'
import ExperienceDungeonBoard from './experience-dungeon-board'
import WeaponDungeonBoard from './weapon-dungeon-board'

function GrowthDungeonHub() {
	return (
		<Tabs defaultValue="weapon" className="gap-4">
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
				<div>용사의 수련장</div>
			</TabsContent>

			<TabsContent value="enhance">
				<div>강화 던전</div>
			</TabsContent>
		</Tabs>
	)
}

export default GrowthDungeonHub
