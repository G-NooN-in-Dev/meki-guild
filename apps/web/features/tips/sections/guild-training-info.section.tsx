import { Badge } from '@shared/ui/badge'

import GuildTrainingInfoSummary from '@/features/tips/components/guild-training/guild-training-info-summary'
import GuildTrainingInfoTable from '@/features/tips/components/guild-training/guild-training-info-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipTagsBySlug } from '@/features/tips/lib/tips-registry.constants'

import MonsterPortrait from '../components/shared/monster-portrait'
import { GUILD_TRAINING_BOT_PORTRAIT } from '../lib/guild-training-info.constants'

function GuildTrainingInfoSection() {
	const tags = getTipTagsBySlug('guild-training-info')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex items-center justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-2">
						<div className="flex flex-wrap gap-1.5">
							{tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">길드 수련장 명중컷 · 처치 점수</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
							길드 수련장 단계별 필요 명중과 처치 점수를 확인해보세요.
						</p>
					</div>

					<MonsterPortrait src={GUILD_TRAINING_BOT_PORTRAIT} alt="허수아비" size="lg" className="size-20 md:size-24" />
				</header>
			</div>

			<GuildTrainingInfoSummary />
			<GuildTrainingInfoTable />
		</section>
	)
}

export default GuildTrainingInfoSection
