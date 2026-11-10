import { Badge } from '@shared/ui/badge'

import GuildExpeditionSummary from '@/features/tips/components/guild-expedition/guild-expedition-summary'
import GuildExpeditionTable from '@/features/tips/components/guild-expedition/guild-expedition-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import MonsterLabel from '@/features/tips/components/shared/monster-label'
import { GUILD_EXPEDITION_BOSS } from '@/features/tips/lib/guild-expedition.constants'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

function GuildExpeditionSection() {
	const title = getTipTitleBySlug('guild-expedition')
	const badges = getTipBadgeLabelsBySlug('guild-expedition')
	const { imageSrc, imageWidth, imageHeight, label } = GUILD_EXPEDITION_BOSS

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex items-center justify-between gap-3 md:gap-6">
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<div className="flex flex-wrap gap-1.5">
							{badges.map((badgeLabel) => (
								<Badge key={badgeLabel} variant="secondary">
									{badgeLabel}
								</Badge>
							))}
						</div>
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{title}</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base lg:max-w-3xl">
							길드 토벌전 단계별 방어력, 필요 명중과 제한시간을 확인해보세요.
						</p>
					</div>
					<MonsterLabel src={imageSrc} alt={label} width={imageWidth} height={imageHeight} unoptimized size="header" />
				</header>
			</div>

			<GuildExpeditionSummary />
			<GuildExpeditionTable />
		</section>
	)
}

export default GuildExpeditionSection
