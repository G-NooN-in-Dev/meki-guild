import { Badge } from '@shared/ui/badge'

import GuildRivalryRankPredictBoard from '@/features/tips/components/guild-rivalry-rank-predict/guild-rivalry-rank-predict-board.client'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

/** 길드 대항전 순위 예측 — 길드명 입력 후 전투력 기반 예상 순위를 보여 줍니다. */
function GuildRivalryRankPredictSection() {
	const title = getTipTitleBySlug('guild-rivalry-rank-predict')
	const badges = getTipBadgeLabelsBySlug('guild-rivalry-rank-predict')

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
						매칭된 길드들의 길드원 전투력을 기준으로, 대항전 길드 예상 순위를 대략적으로 예측합니다.
					</p>
				</header>
			</div>

			<GuildRivalryRankPredictBoard />
		</section>
	)
}

export default GuildRivalryRankPredictSection
