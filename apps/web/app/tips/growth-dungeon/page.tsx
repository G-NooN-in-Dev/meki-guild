import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GrowthDungeonSection from '@/features/tips/sections/growth-dungeon.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('growth-dungeon'),
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
