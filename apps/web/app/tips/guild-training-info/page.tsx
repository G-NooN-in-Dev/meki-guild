import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildTrainingInfoSection from '@/features/tips/sections/guild-training-info.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-training-info'),
	description: '길드 수련장 단계별 필요 명중과 처치 점수를 확인해보세요.'
}

function GuildTrainingInfoPage() {
	return (
		<PageShell>
			<GuildTrainingInfoSection />
		</PageShell>
	)
}

export default GuildTrainingInfoPage
