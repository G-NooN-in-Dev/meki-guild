import { Badge } from '@shared/ui/badge'

import ContentStageCutChart from '@/features/tips/components/content-stage-cut-chart'
import TipsBackLink from '@/features/tips/components/tips-back-link'

function ContentStageCutSection() {
	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						컨텐츠
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">컨텐츠 별 스테이지컷</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						컨텐츠 및 난이도 별 스테이지 컷을 확인해보세요.
					</p>
				</header>
			</div>

			<ContentStageCutChart />
		</section>
	)
}

export default ContentStageCutSection
