import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import PartyQuestSection from '@/features/tips/sections/party-quest.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('party-quest'),
	description: '파티퀘스트 난이도별 필요 명중, 방어력 및 보상을 확인해보세요.'
}

function PartyQuestPage() {
	return (
		<PageShell>
			<PartyQuestSection />
		</PageShell>
	)
}

export default PartyQuestPage
