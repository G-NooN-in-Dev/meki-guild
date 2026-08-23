/**
 * 성장 던전 정보 페이지.
 */

import { Badge } from '@shared/ui/badge'

import GrowthDungeonHub from '../components/growth-dungeon/growth-dungeon-hub'
import TipsBackLink from '../components/hub/tips-back-link'
import { getTipTagsBySlug } from '../lib/tips-registry.constants'

function GrowthDungeonSection() {
	const tags = getTipTagsBySlug('growth-dungeon')

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
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">성장 던전 정보</h1>
				</header>
			</div>

			<GrowthDungeonHub />
		</section>
	)
}

export default GrowthDungeonSection
