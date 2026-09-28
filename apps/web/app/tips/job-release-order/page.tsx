import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import JobReleaseOrderSection from '@/features/tips/sections/job-release-order.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('job-release-order'),
	description: '원작 메이플스토리 직업 출시 순서로 메이플키우기 다음 직업을 가늠해보세요.'
}

function JobReleaseOrderPage() {
	return (
		<PageShell>
			<JobReleaseOrderSection />
		</PageShell>
	)
}

export default JobReleaseOrderPage
