'use client'

import { useState } from 'react'

import GuildContentSeasonsGuide from '@/features/guild/components/guild-content-seasons-guide'
import SeasonStatusItem from '@/features/guild/components/guild-content-seasons-status-item'
import type { GuildContentSeasonSummary, GuildSeasonalContentKey } from '@/libs/guild-content-seasons.constants'

type HomeSeasonsPanelProps = {
	summaries: GuildContentSeasonSummary[]
}

/**
 * 홈 허브용 시즌 상태.
 * 카드를 누르면 해당 컨텐츠 탭이 열린 시즌 일정 Dialog를 표시합니다.
 */
function HomeSeasonsPanel({ summaries }: HomeSeasonsPanelProps) {
	const [open, setOpen] = useState(false)
	const [selectedContent, setSelectedContent] = useState<GuildSeasonalContentKey>(summaries[0]?.content ?? 'rivalry')

	const handleSelect = (content: GuildSeasonalContentKey) => {
		setSelectedContent(content)
		setOpen(true)
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-3">
			<div className="grid gap-3 md:grid-cols-3">
				{summaries.map((summary) => (
					<SeasonStatusItem key={summary.content} summary={summary} onSelect={() => handleSelect(summary.content)} />
				))}
			</div>

			<GuildContentSeasonsGuide
				open={open}
				onOpenChange={setOpen}
				defaultContent={selectedContent}
				showTrigger={false}
			/>
		</div>
	)
}

export default HomeSeasonsPanel
