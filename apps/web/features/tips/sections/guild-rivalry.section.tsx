import { Badge } from '@shared/ui/badge'

import GuildRivalryBossPatterns from '@/features/tips/components/guild-rivalry/guild-rivalry-boss-patterns'
import GuildRivalryRankPointsTable from '@/features/tips/components/guild-rivalry/guild-rivalry-rank-points-table'
import GuildRivalrySummary from '@/features/tips/components/guild-rivalry/guild-rivalry-summary'
import GuildRivalryTable from '@/features/tips/components/guild-rivalry/guild-rivalry-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

function GuildRivalrySection() {
	const title = getTipTitleBySlug('guild-rivalry')
	const badges = getTipBadgeLabelsBySlug('guild-rivalry')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<div className="flex flex-wrap gap-1.5">
						{badges.map((label) => (
							<Badge key={label} variant="secondary">
								{label}
							</Badge>
						))}
					</div>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{title}</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base lg:max-w-3xl">
						길드 대항전 방어력·필요 명중·보스 패턴과 순위별 길드 포인트를 확인해보세요.
					</p>
				</header>
			</div>

			<GuildRivalrySummary />
			<GuildRivalryBossPatterns />
			<GuildRivalryRankPointsTable />
			<GuildRivalryTable />
		</section>
	)
}

export default GuildRivalrySection
