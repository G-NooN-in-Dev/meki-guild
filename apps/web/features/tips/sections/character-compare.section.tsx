import { Badge } from '@shared/ui/badge'

import CharacterCompareBoard from '@/features/tips/components/character-compare/character-compare-board.client'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

/** 상대방 닉네임 입력 후 mgf 스펙을 나란히 보여 줍니다. */
function CharacterCompareSection() {
	const title = getTipTitleBySlug('character-compare')
	const badges = getTipBadgeLabelsBySlug('character-compare')

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
						나와 상대방 닉네임을 입력하여 스펙과 랭킹을 비교해보세요.
					</p>
				</header>
			</div>

			<CharacterCompareBoard />
		</section>
	)
}

export default CharacterCompareSection
