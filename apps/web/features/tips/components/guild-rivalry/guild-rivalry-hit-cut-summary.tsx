import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import {
	GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MAX,
	GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MIN,
	GUILD_RIVALRY_BUFF_STACK_PER_MOB,
	GUILD_RIVALRY_BUFF_STACK_PER_STAGE,
	GUILD_RIVALRY_HIT_BONUS_MAX_DIFF,
	GUILD_RIVALRY_MOBS_PER_STAGE,
	GUILD_RIVALRY_SPAWN_HIT_BONUS,
	GUILD_RIVALRY_SPAWN_HIT_DECAY,
	GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC,
	GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC,
	GUILD_RIVALRY_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-rivalry-hit-cut.constants'

const headerText = '규칙 정리'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_SEC}초</EmphasizedText> 가 주어집니다. 제한시간 내에 단계를
				클리어하면 제한시간이 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC}초</EmphasizedText> 씩 충전되며,
				충전되어도 기본 제한시간 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_SEC}초</EmphasizedText> 는 넘지 않습니다.
			</li>
			<li>
				보스 등장 전 잡몹이 <EmphasizedText>{GUILD_RIVALRY_MOBS_PER_STAGE}마리</EmphasizedText> 나옵니다. 잡몹을
				처치하면 마리당 <EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_MOB}</EmphasizedText> 스택을 얻어 단계마다{' '}
				<EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_STAGE}</EmphasizedText> 스택이 증가합니다.
			</li>
			<li>
				잡몹이 등장하면 필요 명중이 표의 기본 수치에서 <EmphasizedText>+{GUILD_RIVALRY_SPAWN_HIT_BONUS}</EmphasizedText>{' '}
				증가하고, 이후 <EmphasizedText>{GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC}초</EmphasizedText> 마다{' '}
				<EmphasizedText>−{GUILD_RIVALRY_SPAWN_HIT_DECAY}</EmphasizedText> 씩 감소합니다. 기본 수치 이하로는 내려가지
				않습니다.
			</li>
			<li>
				보스 몬스터의 공격을 받으면 스택이 감소합니다. 감소 스택은 디버프 내성에 따라 달라집니다. (
				<EmphasizedText>
					- {GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MIN}~{GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MAX}
				</EmphasizedText>
				)
			</li>
			<li>
				명중이 필요 수치보다 높으면 최대 <EmphasizedText>{GUILD_RIVALRY_HIT_BONUS_MAX_DIFF}</EmphasizedText> 차이까지{' '}
				<EmphasizedText>최종 데미지</EmphasizedText> 가 증가합니다.
			</li>
			<li>
				보스 몬스터를 <EmphasizedText>막타</EmphasizedText>칠 때 남아 있던 <EmphasizedText>보스의 체력</EmphasizedText>
				과 <EmphasizedText>딜량</EmphasizedText>에 따라 <EmphasizedText>점수</EmphasizedText>가 증가합니다.
			</li>
		</ul>
	)
}

/** 대항전 명중·스택 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. 모바일은 접고, md 이상은 펼칩니다. */
function GuildRivalryHitCutSummary() {
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

export default GuildRivalryHitCutSummary
