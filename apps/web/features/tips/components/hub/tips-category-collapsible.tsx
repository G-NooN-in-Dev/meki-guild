'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import TipCard from '@/features/tips/components/hub/tip-card'
import type { TipCategory, TipCategoryGroup, TipEntry } from '@/features/tips/types/tip.type'

const triggerClassName = cn(
	'group border-grayscale-300 shadow-soft flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border-2 bg-white p-3 text-left',
	'text-grayscale-900 text-lg font-semibold md:text-xl',
	'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
)

type TipsCategoryCollapsibleProps = {
	groups: readonly TipCategoryGroup[]
}

type TipCategoryCollapsibleItemProps = {
	category: TipCategory
	tips: readonly TipEntry[]
}

function TipCardList({ tips }: { tips: readonly TipEntry[] }) {
	return (
		<ul className="grid grid-cols-2 gap-4 rounded-md bg-transparent p-3 sm:flex sm:flex-col">
			{tips.map((tip) => (
				<li key={tip.slug} className="h-full">
					<TipCard tip={tip} />
				</li>
			))}
		</ul>
	)
}

/** 클릭 토글 · 기본 펼침 (모바일·데스크탑 동일) */
function TipCategoryCollapsibleItem({ category, tips }: TipCategoryCollapsibleItemProps) {
	const { label } = category

	return (
		<Collapsible defaultOpen className="flex w-full min-w-0 flex-col self-start">
			<CollapsibleTrigger className={triggerClassName}>
				{label}
				<ChevronDownIcon
					aria-hidden
					className="text-grayscale-400 size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
				/>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<TipCardList tips={tips} />
			</CollapsibleContent>
		</Collapsible>
	)
}

/**
 * 카테고리별 독립 Collapsible.
 * 레이아웃: 모바일 flex-col · tipCard 2열 / sm+: 카테고리 2·3열 · tipCard 세로 나열.
 * 상호작용: 클릭 토글 · 기본 펼침.
 */
function TipsCategoryCollapsible({ groups }: TipsCategoryCollapsibleProps) {
	return (
		<div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 lg:grid-cols-3 lg:gap-6">
			{groups.map(({ category, tips }) => (
				<TipCategoryCollapsibleItem key={category.id} category={category} tips={tips} />
			))}
		</div>
	)
}

export default TipsCategoryCollapsible
