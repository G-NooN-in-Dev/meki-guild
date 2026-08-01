import { Badge } from '@shared/ui/badge'

import ContentStageCutChart from '@/features/tips/components/content-stage-cut-chart'
import TipsBackLink from '@/features/tips/components/tips-back-link'

function ContentStageCutSection() {
	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<div className="flex flex-wrap gap-1.5">
						<Badge variant="secondary">파티퀘스트</Badge>
						<Badge variant="secondary">보스레이드</Badge>
					</div>
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
