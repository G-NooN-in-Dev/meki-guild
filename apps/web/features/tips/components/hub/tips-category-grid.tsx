import TipCard from '@/features/tips/components/hub/tip-card'
import type { TipCategoryGroup } from '@/features/tips/types/tip.type'

type TipsCategoryGridProps = {
	groups: readonly TipCategoryGroup[]
}

/** 카테고리별 팁 목록. 정보 카테고리만 2열을 차지합니다. */
function TipsCategoryGrid({ groups }: TipsCategoryGridProps) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
			{groups.map(({ category, tips }) => {
				const { id, label } = category
				const isInfoCategory = id === 'info'

				return (
					<section
						key={id}
						className={isInfoCategory ? 'col-span-2 flex min-w-0 flex-col gap-4' : 'flex min-w-0 flex-col gap-4'}
					>
						<h2 className="text-grayscale-900 text-lg font-semibold md:text-xl">{label}</h2>
						<ul className={isInfoCategory ? 'grid grid-cols-2 gap-4 lg:gap-x-6' : 'flex flex-col gap-4'}>
							{tips.map((tip) => (
								<li key={tip.slug} className="h-full">
									<TipCard tip={tip} />
								</li>
							))}
						</ul>
					</section>
				)
			})}
		</div>
	)
}

export default TipsCategoryGrid
