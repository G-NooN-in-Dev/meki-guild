import { cn } from '@shared/ui/utils'

import type { ChangelogItem } from '@/features/updates/types/changelog.type'

type ChangelogItemListProps = {
	items: readonly ChangelogItem[]
	className?: string
}

/** 구역 안 불릿. children이 있으면 한 단 더 들여 씁니다. */
function ChangelogItemList({ items, className }: ChangelogItemListProps) {
	return (
		<ul className={cn('list-disc space-y-1.5 pl-5', className)}>
			{items.map((item, index) => (
				<li key={`${item.text}-${index}`} className="text-grayscale-700 text-sm leading-relaxed md:text-base">
					{item.text}
					{item.children && item.children.length > 0 ? (
						<ChangelogItemList items={item.children} className="mt-1.5" />
					) : null}
				</li>
			))}
		</ul>
	)
}

export default ChangelogItemList
