import { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GrowthDungeonSection from '@/features/tips/sections/growth-dungeon.section'

export const metadata: Metadata = {
	title: '성장 던전 정보',
	description: '성장 던전 정보를 확인해보세요.'
}

function GrowthDungeonPage() {
	return (
		<PageShell>
			<GrowthDungeonSection />
		</PageShell>
	)
}

export default GrowthDungeonPage
