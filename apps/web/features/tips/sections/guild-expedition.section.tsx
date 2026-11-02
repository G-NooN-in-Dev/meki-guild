import { Badge } from '@shared/ui/badge'
import Image from 'next/image'

import GuildExpeditionSummary from '@/features/tips/components/guild-expedition/guild-expedition-summary'
import GuildExpeditionTable from '@/features/tips/components/guild-expedition/guild-expedition-table'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { GUILD_EXPEDITION_BOSS } from '@/features/tips/lib/guild-expedition.constants'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

/** 페이지 헤더의 보스 스프라이트. GIF 흰 배경은 페이지 일러스트에 섞이도록 뺍니다. */
function GuildExpeditionBossImage() {
	const { imageSrc, imageWidth, imageHeight, label } = GUILD_EXPEDITION_BOSS

	return (
		<Image
			src={imageSrc}
			alt={label}
			width={imageWidth}
			height={imageHeight}
			unoptimized
			draggable={false}
			className="xs:h-20 h-16 w-auto shrink-0 object-contain mix-blend-darken md:h-28"
		/>
	)
}

function GuildExpeditionSection() {
	const title = getTipTitleBySlug('guild-expedition')
	const badges = getTipBadgeLabelsBySlug('guild-expedition')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex items-center justify-between gap-3 md:gap-6">
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<div className="flex flex-wrap gap-1.5">
							{badges.map((label) => (
								<Badge key={label} variant="secondary">
									{label}
								</Badge>
							))}
						</div>
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{title}</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base lg:max-w-3xl">
							길드 토벌전 단계별 방어력, 필요 명중과 제한시간을 확인해보세요.
						</p>
					</div>
					<GuildExpeditionBossImage />
				</header>
			</div>

			<GuildExpeditionSummary />
			<GuildExpeditionTable />
		</section>
	)
}

export default GuildExpeditionSection
