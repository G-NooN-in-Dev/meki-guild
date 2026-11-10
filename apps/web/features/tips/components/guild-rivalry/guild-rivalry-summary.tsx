import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import {
	GUILD_RIVALRY_BUFF_STACK_PER_MOB,
	GUILD_RIVALRY_BUFF_STACK_PER_STAGE,
	GUILD_RIVALRY_HIT_BONUS_MAX_DIFF,
	GUILD_RIVALRY_MOBS_PER_STAGE,
	GUILD_RIVALRY_SPAWN_HIT_BONUS,
	GUILD_RIVALRY_SPAWN_HIT_DECAY,
	GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC,
	GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC,
	GUILD_RIVALRY_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-rivalry.constants'

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				기본 제한시간 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_SEC}초</EmphasizedText>가 주어집니다.
			</li>
			<li>
				제한시간 안에 잡몹 <EmphasizedText>{GUILD_RIVALRY_MOBS_PER_STAGE}마리</EmphasizedText>를 처치한 뒤 보스를
				처치하세요.
			</li>
			<li>
				보스를 처치하면 <EmphasizedText>{GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC}초</EmphasizedText>가 충전됩니다. 단, 직전
				단계의 시작 제한시간은 넘지 않습니다.
			</li>
			<li>
				잡몹의 명중은 기준 명중 <EmphasizedText>+{GUILD_RIVALRY_SPAWN_HIT_BONUS}</EmphasizedText>으로 시작하여 이후 기준
				명중까지 <EmphasizedText>{GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC}초</EmphasizedText>마다{' '}
				<EmphasizedText>−{GUILD_RIVALRY_SPAWN_HIT_DECAY}</EmphasizedText>씩 감소합니다.
			</li>
			<li>
				잡몹을 처치하면 마리당 <EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_MOB}</EmphasizedText> 스택을 획득합니다.
				최종적으로 단계마다 <EmphasizedText>+{GUILD_RIVALRY_BUFF_STACK_PER_STAGE}</EmphasizedText> 스택이 증가합니다.
			</li>
			<li>
				플레이어의 명중이 필요 명중보다 높은 경우, 최대{' '}
				<EmphasizedText>{GUILD_RIVALRY_HIT_BONUS_MAX_DIFF}</EmphasizedText> 차이까지{' '}
				<EmphasizedText>최종 데미지</EmphasizedText>가 증가합니다.
			</li>
		</ul>
	)
}

/** 대항전 명중·스택 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildRivalrySummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildRivalrySummary
