import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import {
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT,
	ENHANCE_DUNGEON_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

const headerText = '규칙 정리'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{ENHANCE_DUNGEON_TIME_LIMIT_SEC}초</EmphasizedText> 안에{' '}
				<EmphasizedText>발록</EmphasizedText>을 처치하세요.
			</li>
			<li>
				<EmphasizedText>{ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT}%</EmphasizedText> 확률로{' '}
				<EmphasizedText>의문의 주문서</EmphasizedText>를 획득할 수 있습니다. 획득 시 단계에 따라{' '}
				<EmphasizedText>노말 · 레어 · 에픽</EmphasizedText>으로 나뉘고, 레어·에픽은 세부 종류로 균등 분배됩니다.
			</li>
		</ul>
	)
}

/** 강화 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. 모바일은 접고, md 이상은 펼칩니다. */
function EnhanceDungeonSummary() {
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
					{headerText}
					<ChevronDownIcon
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-grayscale-200 border-t px-4 py-3">
						<SummaryRulesList />
					</div>
				</CollapsibleContent>
			</Collapsible>

			<div className="hidden md:contents">
				<CardHeader>
					<CardTitle className="text-grayscale-900 text-lg font-semibold">{headerText}</CardTitle>
				</CardHeader>
				<CardContent>
					<SummaryRulesList />
				</CardContent>
			</div>
		</Card>
	)
}

export default EnhanceDungeonSummary
