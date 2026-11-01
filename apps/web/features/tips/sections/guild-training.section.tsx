import { Badge } from '@shared/ui/badge'

import GuildTrainingSummary from '@/features/tips/components/guild-training/guild-training-summary'
import GuildTrainingTable from '@/features/tips/components/guild-training/guild-training-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

function GuildTrainingSection() {
	const title = getTipTitleBySlug('guild-training')
	const badges = getTipBadgeLabelsBySlug('guild-training')

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
						길드 수련장 단계별 필요 명중과 처치 점수를 확인해보세요.
					</p>
				</header>
			</div>

			<GuildTrainingSummary />
			<GuildTrainingTable />
		</section>
	)
}

export default GuildTrainingSection
