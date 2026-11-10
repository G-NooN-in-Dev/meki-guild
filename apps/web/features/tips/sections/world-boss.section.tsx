import { Badge } from '@shared/ui/badge'

import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import MonsterLabel from '@/features/tips/components/shared/monster-label'
import WorldBossSummary from '@/features/tips/components/world-boss/world-boss-summary'
import WorldBossTable from '@/features/tips/components/world-boss/world-boss-table'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import { WORLD_BOSS_META } from '@/features/tips/lib/world-boss.constants'

function WorldBossSection() {
	const title = getTipTitleBySlug('world-boss')
	const badges = getTipBadgeLabelsBySlug('world-boss')
	const { imageSrc, imageWidth, imageHeight, label } = WORLD_BOSS_META

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
							월드보스 단계별 방어력과 필요 명중을 확인해보세요.
						</p>
					</div>
					<MonsterLabel src={imageSrc} alt={label} width={imageWidth} height={imageHeight} unoptimized size="header" />
				</header>
			</div>

			<WorldBossSummary />
			<WorldBossTable />
		</section>
	)
}

export default WorldBossSection
