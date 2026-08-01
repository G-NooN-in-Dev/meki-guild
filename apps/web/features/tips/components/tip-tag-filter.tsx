'use client'

import { cn } from '@shared/ui/utils'

type TipTagFilterProps = {
	/** 필터에 노출할 태그 목록 */
	tags: readonly string[]
	/** 선택된 태그. null이면 전체 */
	selectedTag: string | null
	onSelectTag: (tag: string | null) => void
}

/**
 * 허브 상단 태그 필터.
 * 태그가 늘어나도 가로 스크롤로 넘칠 수 있게 한다.
 */
function TipTagFilter({ tags, selectedTag, onSelectTag }: TipTagFilterProps) {
	return (
		<div
			role="tablist"
			aria-label="태그 필터"
			className="flex min-w-0 scrollbar-none items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			<button
				type="button"
				role="tab"
				aria-selected={selectedTag === null}
				onClick={() => onSelectTag(null)}
				className={cn(
					'shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
					selectedTag === null
						? 'border-grayscale-900 bg-grayscale-900 text-white'
						: 'border-grayscale-200 bg-background text-grayscale-700 hover:border-grayscale-300 hover:bg-grayscale-50'
				)}
			>
				전체
			</button>
			{tags.map((tag) => {
				const isSelected = selectedTag === tag

				return (
					<button
						key={tag}
						type="button"
						role="tab"
						aria-selected={isSelected}
						onClick={() => onSelectTag(isSelected ? null : tag)}
						className={cn(
							'shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
							isSelected
								? 'border-grayscale-900 bg-grayscale-900 text-white'
								: 'border-grayscale-200 bg-background text-grayscale-700 hover:border-grayscale-300 hover:bg-grayscale-50'
						)}
					>
						{tag}
					</button>
				)
			})}
		</div>
	)
}

export default TipTagFilter
