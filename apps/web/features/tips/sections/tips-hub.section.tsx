'use client'

import { useState } from 'react'

import TipCard from '@/features/tips/components/tip-card'
import TipTagFilter from '@/features/tips/components/tip-tag-filter'
import {
	TIP_CATEGORY_LABELS,
	TIP_CATEGORY_ORDER,
	TIP_ENTRIES,
	TIP_TAGS
} from '@/features/tips/lib/tips-registry.constants'
import type { TipCategory, TipEntry } from '@/features/tips/types/tip.type'

function TipsHubSection() {
	const [selectedTag, setSelectedTag] = useState<string | null>(null)

	/** 선택된 태그로 필터링한 뒤, 카테고리별 섹션으로 묶는다. */
	function groupTipsByCategory(tips: readonly TipEntry[], selectedTag: string | null) {
		const filtered = selectedTag ? tips.filter((tip) => tip.tags.includes(selectedTag)) : [...tips]

		return TIP_CATEGORY_ORDER.flatMap((category) => {
			const items = filtered.filter((tip) => tip.category === category)
			if (items.length === 0) return []
			return [{ category, items }] satisfies { category: TipCategory; items: TipEntry[] }[]
		})
	}

	const groups = groupTipsByCategory(TIP_ENTRIES, selectedTag)

	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">메이플키우기 참고 자료</p>
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">정보 / 팁</h1>
				<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
					길드 운영·콘텐츠에 도움이 되는 정보와 팁을 모아둔 공간입니다.
				</p>
			</header>

			<TipTagFilter tags={TIP_TAGS} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

			{groups.length === 0 ? (
				<p className="text-grayscale-500 py-8 text-center text-sm">해당 태그의 페이지가 없습니다.</p>
			) : (
				<div className="flex flex-col gap-8 md:gap-10">
					{groups.map(({ category, items }) => (
						<section key={category} className="flex flex-col gap-3 md:gap-4">
							<h2 className="text-grayscale-900 text-lg font-semibold md:text-xl">{TIP_CATEGORY_LABELS[category]}</h2>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{items.map((tip) => (
									<TipCard key={tip.slug} tip={tip} />
								))}
							</div>
						</section>
					))}
				</div>
			)}
		</section>
	)
}

export default TipsHubSection
