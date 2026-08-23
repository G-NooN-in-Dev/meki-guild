'use client'

import { useState } from 'react'

import StageJourneyChapterTable from '@/features/tips/components/stage-journey-chapter-table'
import StageJourneyEffectTable from '@/features/tips/components/stage-journey-effect-table'
import { STAGE_JOURNEY_DEFAULT_CHAPTER } from '@/features/tips/lib/stage-journey.constants'

function StageJourneyBoard() {
	const [selectedChapter, setSelectedChapter] = useState<number>(STAGE_JOURNEY_DEFAULT_CHAPTER)

	return (
		<>
			<div className="flex flex-col gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">챕터별 보상 · 특수 옵션</h2>
				<p className="text-grayscale-500 text-xs md:text-sm">
					보스를 선택하면 해당 챕터의 보유 효과를 아래에 표시합니다.
				</p>
				<StageJourneyChapterTable selectedChapter={selectedChapter} onSelectChapter={setSelectedChapter} />
			</div>

			<StageJourneyEffectTable chapter={selectedChapter} />
		</>
	)
}

export default StageJourneyBoard
