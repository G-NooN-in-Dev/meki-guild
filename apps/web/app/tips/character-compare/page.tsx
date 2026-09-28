import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import CharacterCompareSection from '@/features/tips/sections/character-compare.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('character-compare'),
	description: '원하는 상대방과 1 vs 1 비교를 해보세요.'
}

function CharacterComparePage() {
	return (
		<PageShell>
			<CharacterCompareSection />
		</PageShell>
	)
}

export default CharacterComparePage
