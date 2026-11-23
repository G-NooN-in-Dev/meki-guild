import Link from 'next/link'
import type { ReactNode } from 'react'

import GuildDetailSectionTabs from '@/features/guild/components/guild-detail-section-tabs'
import GuildGrowthPodiumMarquee from '@/features/guild/components/guild-growth-podium-marquee'
import type { ContentAwardSlot } from '@/features/guild/lib/select-content-award-winners'
import { getReadyContentAwardSlots } from '@/features/guild/lib/select-content-award-winners'

type GuildDetailShellSectionProps = {
	awardSlots: ContentAwardSlot[]
	children: ReactNode
}

/**
 * 상세 공유 셸. layout에 두어 `[section]` 이동 시에도 Marquee·탭이 리마운트되지 않습니다.
 */
function GuildDetailShellSection({ awardSlots, children }: GuildDetailShellSectionProps) {
	const readyAwardSlots = getReadyContentAwardSlots(awardSlots)

	return (
		<section className="flex w-full min-w-0 flex-col gap-4">
			<p className="text-grayscale-500 text-sm">
				<Link href="/guild" className="hover:text-grayscale-800 underline-offset-2 hover:underline">
					← 대시보드
				</Link>
			</p>

			<GuildGrowthPodiumMarquee slots={readyAwardSlots} />

			<GuildDetailSectionTabs />

			{children}
		</section>
	)
}

export default GuildDetailShellSection
