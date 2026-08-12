'use client'

import { useMemo, useState } from 'react'

import TipCard from '@/features/tips/components/tip-card'
import TipTagFilter from '@/features/tips/components/tip-tag-filter'
import type { TipEntry } from '@/features/tips/types/tip.type'

type TipsHubFilteredListProps = {
	tags: readonly string[]
	tips: readonly TipEntry[]
}

function TipsHubFilteredList({ tags, tips }: TipsHubFilteredListProps) {
	const [selectedTag, setSelectedTag] = useState<string | null>(null)

	const filteredTips = useMemo(() => {
		if (!selectedTag) {
			return [...tips]
		}

		return tips.filter((tip) => tip.tags.includes(selectedTag))
	}, [selectedTag, tips])

	return (
		<>
			<TipTagFilter tags={tags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

			{filteredTips.length === 0 ? (
				<p className="text-grayscale-500 py-8 text-center text-sm">해당 태그의 페이지가 없습니다.</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{filteredTips.map((tip) => (
						<TipCard key={tip.slug} tip={tip} />
					))}
				</div>
			)}
		</>
	)
}

export default TipsHubFilteredList
