/**
 * 성장 던전 정보 페이지.
 */

import GrowthDungeonHub from '../components/growth-dungeon/growth-dungeon-hub'
import TipsBackLink from '../components/hub/tips-back-link'
import { getTipTagsBySlug } from '../lib/tips-registry.constants'

function GrowthDungeonSection() {
	const tags = getTipTagsBySlug('growth-dungeon')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>
			<GrowthDungeonHub tags={tags} />
		</section>
	)
}

export default GrowthDungeonSection
