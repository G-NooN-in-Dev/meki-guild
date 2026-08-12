'use client'

import { Badge } from '@shared/ui/badge'
import { useState } from 'react'

import StageJourneyChapterTable from '@/features/tips/components/stage-journey-chapter-table'
import StageJourneyEffectTable from '@/features/tips/components/stage-journey-effect-table'
import TipsBackLink from '@/features/tips/components/tips-back-link'
import { STAGE_JOURNEY_DEFAULT_CHAPTER } from '@/features/tips/lib/stage-journey.constants'
import { getTipTagsBySlug } from '@/features/tips/lib/tips-registry.constants'

/**
 * 용사의 발자취 정보 페이지.
 * 챕터 요약 표에서 행을 고르면 아래 보유 효과 등급표를 갱신합니다.
 */
function StageJourneySection() {
	const [selectedChapter, setSelectedChapter] = useState<number>(STAGE_JOURNEY_DEFAULT_CHAPTER)
	const tags = getTipTagsBySlug('stage-journey')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<div className="flex flex-wrap gap-1.5">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">용사의 발자취 정보</h1>
					<p className="text-grayscale-600 text-sm md:text-base">
						챕터별 클리어 보상과 보유 효과·특수 옵션을 확인해보세요. 특수 옵션은 보유 효과 3칸이 모두 유니크 등급 이상일
						때 열립니다.
					</p>
				</header>
			</div>

			<div className="flex flex-col gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">챕터별 보상 · 특수 옵션</h2>
				<p className="text-grayscale-500 text-xs md:text-sm">
					보스를 선택하면 해당 챕터의 보유 효과를 아래에 표시합니다.
				</p>
				<StageJourneyChapterTable selectedChapter={selectedChapter} onSelectChapter={setSelectedChapter} />
			</div>

			<StageJourneyEffectTable chapter={selectedChapter} />
		</section>
	)
}

export default StageJourneySection
