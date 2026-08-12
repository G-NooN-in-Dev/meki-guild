'use client'

import { useState } from 'react'

import TipCard from '@/features/tips/components/tip-card'
import TipTagFilter from '@/features/tips/components/tip-tag-filter'
import { TIP_ENTRIES, TIP_TAGS } from '@/features/tips/lib/tips-registry.constants'
import type { TipEntry } from '@/features/tips/types/tip.type'

function TipsHubSection() {
	const [selectedTag, setSelectedTag] = useState<string | null>(null)

	function filterTips(tips: readonly TipEntry[], tag: string | null) {
		if (!tag) {
			return [...tips]
		}

		return tips.filter((tip) => tip.tags.includes(tag))
	}

	const tips = filterTips(TIP_ENTRIES, selectedTag)

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

			{tips.length === 0 ? (
				<p className="text-grayscale-500 py-8 text-center text-sm">해당 태그의 페이지가 없습니다.</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{tips.map((tip) => (
						<TipCard key={tip.slug} tip={tip} />
					))}
				</div>
			)}
		</section>
	)
}

export default TipsHubSection
