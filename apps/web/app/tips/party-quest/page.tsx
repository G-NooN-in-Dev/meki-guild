import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import PartyQuestSection from '@/features/tips/sections/party-quest.section'

export const metadata: Metadata = {
	title: '파티퀘스트 명중컷 및 보상 정보',
	description: '파티퀘스트 명중컷 및 보상을 확인해보세요.'
}

function PartyQuestPage() {
	return (
		<PageShell>
			<PartyQuestSection />
		</PageShell>
	)
}

export default PartyQuestPage
