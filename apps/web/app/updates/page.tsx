import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import ChangelogSection from '@/features/updates/sections/changelog.section'

export const metadata: Metadata = {
	title: '업데이트 일지',
	description: '메이플키우기 게임즈 길드 사이트의 버전별 변경 사항입니다.'
}

function UpdatesPage() {
	return (
		<PageShell>
			<ChangelogSection />
		</PageShell>
	)
}

export default UpdatesPage
