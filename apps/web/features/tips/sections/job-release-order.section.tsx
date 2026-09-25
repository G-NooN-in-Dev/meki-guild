import { Badge } from '@shared/ui/badge'

import TipsBackLink from '@/features/tips/components/hub/tips-back-link'
import JobReleaseOrderTable from '@/features/tips/components/job-release-order/job-release-order-table'
import { getTipBadgeLabelsBySlug, getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'

/**
 * 직업 출시 순서표 페이지.
 * 원작 업데이트 순서로 메키에 아직 안 나온 직업을 가늠해볼 수 있습니다.
 */
function JobReleaseOrderSection() {
	const title = getTipTitleBySlug('job-release-order')
	const badges = getTipBadgeLabelsBySlug('job-release-order')

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
					<p className="text-grayscale-600 text-sm md:text-base">
						원작 메이플스토리 직업 출시 순서표로 다음에 나올 직업을 가늠해보세요.
					</p>
				</header>
			</div>

			<JobReleaseOrderTable />
		</section>
	)
}

export default JobReleaseOrderSection
