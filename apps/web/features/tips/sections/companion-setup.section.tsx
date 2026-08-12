import { Badge } from '@shared/ui/badge'

import CompanionSetupTabs from '@/features/tips/components/companion-setup-tabs.client'
import TipsBackLink from '@/features/tips/components/tips-back-link'
import { getTipTagsBySlug } from '@/features/tips/lib/tips-registry.constants'

/**
 * 동료 장착 효과 정보 페이지.
 * 효과 표 / 세팅 시뮬 탭으로 두 UI를 비교할 수 있습니다.
 */
function CompanionSetupSection() {
	const tags = getTipTagsBySlug('companion-setup')

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
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">동료 장착 효과</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						직업별 장착 효과를 등급·레벨로 비교하거나, 세팅 보드로 최적 세팅을 시뮬레이션해 보세요.
					</p>
				</header>
			</div>

			<CompanionSetupTabs />
		</section>
	)
}

export default CompanionSetupSection
