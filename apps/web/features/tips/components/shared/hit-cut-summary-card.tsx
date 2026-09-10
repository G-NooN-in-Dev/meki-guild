import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type HitCutSummaryCardProps = {
	title?: string
	children: ReactNode
}

/**
 * 명중컷/던전 규칙 요약 카드.
 * 모바일은 Collapsible, md 이상은 펼친 카드로 표시합니다.
 */
function HitCutSummaryCard({ title = '규칙 정리', children }: HitCutSummaryCardProps) {
	return (
		<Card
			size="sm"
			className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0 md:data-[size=sm]:gap-4 md:data-[size=sm]:py-4"
		>
			<Collapsible className="flex flex-col md:hidden">
				<CollapsibleTrigger
					className={cn(
						'group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left',
						'text-grayscale-900 text-base font-semibold',
						'focus-visible:ring-grayscale-900 rounded-md focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					{title}
					<ChevronDownIcon
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-grayscale-200 border-t px-4 py-3">{children}</div>
				</CollapsibleContent>
			</Collapsible>

			<div className="hidden md:contents">
				<CardHeader className="px-4 pt-0 pb-0">
					<CardTitle className="text-grayscale-900 text-lg font-semibold">{title}</CardTitle>
				</CardHeader>
				<CardContent className="px-4 pb-0">{children}</CardContent>
			</div>
		</Card>
	)
}

export default HitCutSummaryCard
