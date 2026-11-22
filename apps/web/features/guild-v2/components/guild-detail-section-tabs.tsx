'use client'

import { cn } from '@shared/ui/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import {
	buildGuildDetailHref,
	GUILD_DETAIL_SECTIONS,
	parseGuildDetailSection
} from '@/features/guild-v2/lib/guild-detail-nav'

/**
 * 상세 항목 탭. path 세그먼트와 동기화하며, layout에 두어 Marquee와 함께 유지됩니다.
 */
function GuildDetailSectionTabs() {
	const segment = useSelectedLayoutSegment()
	const selectedSection = parseGuildDetailSection(segment)

	return (
		<div className="flex flex-wrap gap-2">
			{GUILD_DETAIL_SECTIONS.map((section) => {
				const { id, title } = section
				const isActive = id === selectedSection
				return (
					<Link
						key={id}
						href={buildGuildDetailHref(id)}
						className={cn(
							'rounded-md px-3 py-1.5 text-sm',
							isActive ? 'bg-grayscale-900 text-white' : 'bg-grayscale-100 text-grayscale-700 hover:bg-grayscale-200'
						)}
						aria-current={isActive ? 'page' : undefined}
					>
						{title}
					</Link>
				)
			})}
		</div>
	)
}

export default GuildDetailSectionTabs
