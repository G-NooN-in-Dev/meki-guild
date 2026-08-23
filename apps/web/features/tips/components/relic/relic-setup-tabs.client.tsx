'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

import RelicEffectTable from '@/features/tips/components/relic/relic-effect-table'
import RelicSetupSimulator from '@/features/tips/components/relic/relic-setup-simulator'

function RelicSetupTabs() {
	return (
		<Tabs defaultValue="table" className="gap-4">
			<TabsList className="grid w-full max-w-md grid-cols-2">
				<TabsTrigger value="table">효과 표</TabsTrigger>
				<TabsTrigger value="simulation">세팅 보드</TabsTrigger>
			</TabsList>

			<TabsContent value="table" className="mt-0">
				<RelicEffectTable />
			</TabsContent>

			<TabsContent value="simulation" className="mt-0">
				<RelicSetupSimulator />
			</TabsContent>
		</Tabs>
	)
}

export default RelicSetupTabs
