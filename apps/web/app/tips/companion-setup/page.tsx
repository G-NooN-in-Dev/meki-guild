import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import CompanionSetupSection from '@/features/tips/sections/companion-setup.section'

export const metadata: Metadata = {
	title: '동료 장착 효과',
	description: '직업·등급·레벨에 따른 동료 장착 효과를 확인해보세요.'
}

function CompanionSetupPage() {
	return (
		<PageShell>
			<CompanionSetupSection />
		</PageShell>
	)
}

export default CompanionSetupPage
