import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import ChangelogSection from '@/features/updates/sections/changelog.section'

export const metadata: Metadata = {
	title: '사이트 업데이트 일지',
	description: '사이트 업데이트 내역입니다.'
}

function UpdatesPage() {
	return (
		<PageShell>
			<ChangelogSection />
		</PageShell>
	)
}

export default UpdatesPage
