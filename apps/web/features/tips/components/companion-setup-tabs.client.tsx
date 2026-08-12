'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

import CompanionEffectTable from '@/features/tips/components/companion-effect-table'
import CompanionSetupSimulator from '@/features/tips/components/companion-setup-simulator'

function CompanionSetupTabs() {
	return (
		<Tabs defaultValue="table" className="gap-4">
			<TabsList className="grid w-full max-w-md grid-cols-2">
				<TabsTrigger value="table">효과 표</TabsTrigger>
				<TabsTrigger value="simulation">세팅 보드</TabsTrigger>
			</TabsList>

			<TabsContent value="table" className="mt-0">
				<CompanionEffectTable />
			</TabsContent>

			<TabsContent value="simulation" className="mt-0">
				<CompanionSetupSimulator />
			</TabsContent>
		</Tabs>
	)
}

export default CompanionSetupTabs
