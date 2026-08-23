import { Badge } from '@shared/ui/badge'

import GuildExpeditionHitCutSummary from '@/features/tips/components/guild-expedition/guild-expedition-hit-cut-summary'
import GuildExpeditionHitCutTable from '@/features/tips/components/guild-expedition/guild-expedition-hit-cut-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipTagsBySlug } from '@/features/tips/lib/tips-registry.constants'

function GuildExpeditionHitCutSection() {
	const tags = getTipTagsBySlug('guild-expedition-hit-cut')

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
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">토벌전 명중컷 · 제한시간</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						길드 토벌전 단계별 필요 명중과 제한시간을 확인해보세요.
					</p>
				</header>
			</div>

			<GuildExpeditionHitCutSummary />
			<GuildExpeditionHitCutTable />
		</section>
	)
}

export default GuildExpeditionHitCutSection
