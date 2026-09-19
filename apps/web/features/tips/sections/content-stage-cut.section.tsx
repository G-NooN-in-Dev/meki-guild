import { Badge } from '@shared/ui/badge'

import ContentStageCutChart from '@/features/tips/components/content-stage-cut/content-stage-cut-chart'
import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

function ContentStageCutSection() {
	const title = getTipTitleBySlug('content-stage-cut')
	const badges = getTipBadgeLabelsBySlug('content-stage-cut')

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
						컨텐츠 및 난이도 별 스테이지 컷을 확인해보세요.
					</p>
				</header>
			</div>

			<ContentStageCutChart />
		</section>
	)
}

export default ContentStageCutSection
