import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import WorldBossSection from '@/features/tips/sections/world-boss.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('world-boss'),
	description: '월드보스 단계별 방어력과 필요 명중을 확인해보세요.'
}

function WorldBossPage() {
	return (
		<PageShell>
			<WorldBossSection />
		</PageShell>
	)
}

export default WorldBossPage
