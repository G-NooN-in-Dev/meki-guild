/**
 * 보스레이드 명중컷 및 보상 정보 페이지.
 */

import { Badge } from '@shared/ui/badge'

import BossRaidBoard from '../components/boss-raid/boss-raid-board.client'
import TipsBackLink from '../components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '../lib/tips-registry.constants'

function BossRaidSection() {
	const title = getTipTitleBySlug('boss-raid')
	const badges = getTipBadgeLabelsBySlug('boss-raid')

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
						보스·난이도별 필요 명중과 클리어 보상을 확인해보세요.
					</p>
				</header>
			</div>

			<BossRaidBoard />
		</section>
	)
}

export default BossRaidSection
