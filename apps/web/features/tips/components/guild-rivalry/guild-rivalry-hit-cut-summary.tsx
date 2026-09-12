import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
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

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				기본 제한시간 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_SEC}초</EmphasizedText> 가 주어진 상태에서 시작합니다.
			</li>
			<li>
				주어진 시간 내에 단계를 클리어하면 현재 남은 시간에{' '}
				<EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC}초</EmphasizedText> 가 충전됩니다. 단, 시간이 충전되더라도
				직전 단계의 시작 제한시간은 넘지 않습니다.
			</li>
			<li>
				잡몹 <EmphasizedText>{GUILD_RIVALRY_MOBS_PER_STAGE}마리</EmphasizedText> 가 등장합니다. 잡몹 처치가 완료된
				이후에 보스 몬스터 공략이 가능합니다.
			</li>
			<li>
				각 단계의 잡몹의 명중컷은 해당 단계의{' '}
				<EmphasizedText>필요 명중 +{GUILD_RIVALRY_SPAWN_HIT_BONUS}</EmphasizedText> 으로 시작합니다. 이후{' '}
				<EmphasizedText>{GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC}초</EmphasizedText> 마다{' '}
				<EmphasizedText>−{GUILD_RIVALRY_SPAWN_HIT_DECAY}</EmphasizedText> 씩 감소합니다. 해당 단계의 필요 명중컷
				이하로는 내려가지 않습니다.
			</li>
			<li>
				잡몹을 처치하면 마리당 <EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_MOB}</EmphasizedText> 스택을 획득합니다.
				최종적으로 단계마다 <EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_STAGE}</EmphasizedText> 스택이 증가합니다.
			</li>
			<li>
				보스 몬스터의 공격을 받으면 스택이 감소합니다. 감소 스택은 최소{' '}
				<EmphasizedText>−{GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MIN}</EmphasizedText> 부터 최대{' '}
				<EmphasizedText>−{GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT_MAX}</EmphasizedText> 까지 감소합니다.
			</li>
			<li>
				플레이어의 명중이 필요 명중컷보다 높으면 최대{' '}
				<EmphasizedText>{GUILD_RIVALRY_HIT_BONUS_MAX_DIFF}</EmphasizedText> 차이까지{' '}
				<EmphasizedText>최종 데미지</EmphasizedText> 가 증가합니다.
			</li>
			<li>
				보스 몬스터를 <EmphasizedText>막타</EmphasizedText>칠 때 남아 있던 <EmphasizedText>보스의 체력</EmphasizedText>
				과 <EmphasizedText>딜량</EmphasizedText>에 따라 <EmphasizedText>점수</EmphasizedText>가 증가합니다.
			</li>
		</ul>
	)
}

/** 대항전 명중·스택 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildRivalryHitCutSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildRivalryHitCutSummary
