import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import {
	GUILD_EXPEDITION_LATE_TIER_START_STAGE,
	GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC,
	GUILD_EXPEDITION_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-expedition-hit-cut.constants'

const headerText = '규칙 정리'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_SEC}초</EmphasizedText> 가 주어집니다. 제한시간 내에
				단계를 클리어하면 제한시간이 <EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC}초</EmphasizedText> 씩
				충전됩니다.
			</li>
			<li>
				<EmphasizedText>{GUILD_EXPEDITION_LATE_TIER_START_STAGE}단계</EmphasizedText>부터는 제한시간 내에 단계를
				클리어해도 제한시간이 <EmphasizedText>충전되지 않습니다</EmphasizedText>.
			</li>
		</ul>
	)
}

/** 토벌전 명중·제한시간 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. 모바일은 접고, md 이상은 펼칩니다. */
function GuildExpeditionHitCutSummary() {
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

export default GuildExpeditionHitCutSummary
