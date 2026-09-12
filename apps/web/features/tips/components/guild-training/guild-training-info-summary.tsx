import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'

import {
	GUILD_TRAINING_NORMAL_DEATH_STATE_RECOVERY_SEC,
	GUILD_TRAINING_NORMAL_MOB_COUNT,
	GUILD_TRAINING_NORMAL_MOB_SPAWN_COOLDOWN_SEC,
	GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC,
	GUILD_TRAINING_SPECIAL_MOB_COUNT,
	GUILD_TRAINING_SPECIAL_MOB_SPAWN_COOLDOWN_SEC,
	GUILD_TRAINING_TIME_BONUS_KILL_INTERVAL,
	GUILD_TRAINING_TIME_BONUS_SEC,
	GUILD_TRAINING_TIME_LIMIT_SEC
} from '../../lib/guild-training-info.constants'

/**
 * 길드 수련장 규칙 요약.
 */
function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				기본 제한시간 <EmphasizedText>{GUILD_TRAINING_TIME_LIMIT_SEC}초</EmphasizedText> 가 주어집니다.
			</li>
			<li>
				일반몹 <EmphasizedText>{GUILD_TRAINING_NORMAL_MOB_COUNT} 마리</EmphasizedText>와, 특수몹{' '}
				<EmphasizedText>{GUILD_TRAINING_SPECIAL_MOB_COUNT} 마리</EmphasizedText>가 소환됩니다.
			</li>
			<li>
				일반몹을 <EmphasizedText>{GUILD_TRAINING_TIME_BONUS_KILL_INTERVAL} 마리</EmphasizedText> 처치할 때마다
				제한시간이 <EmphasizedText>{GUILD_TRAINING_TIME_BONUS_SEC}초</EmphasizedText> 증가합니다.
			</li>
			<li>
				처치된 일반몹은 <EmphasizedText>{GUILD_TRAINING_NORMAL_MOB_SPAWN_COOLDOWN_SEC}초</EmphasizedText>, 특수몹은{' '}
				<EmphasizedText>{GUILD_TRAINING_SPECIAL_MOB_SPAWN_COOLDOWN_SEC}초</EmphasizedText> 후 다음 레벨로 소환됩니다.
			</li>
			<li>
				각 특수몹의 처치 효과는 아래와 같습니다.
				<ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm md:text-base">
					<li>
						5시 방향 : <EmphasizedText>{GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC}초</EmphasizedText> 동안{' '}
						<EmphasizedText>공격 속도</EmphasizedText> 증가, <EmphasizedText>이동 속도</EmphasizedText> 증가,{' '}
						<EmphasizedText>기본 공격 데미지</EmphasizedText> 증가
					</li>
					<li>
						7시 방향 : <EmphasizedText>{GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC}초</EmphasizedText> 동안 최종
						데미지 증가
					</li>
					<li>
						11시 방향 : 모든 일반몹의 체력이{' '}
						<EmphasizedText>{GUILD_TRAINING_NORMAL_DEATH_STATE_RECOVERY_SEC}초</EmphasizedText> 동안{' '}
						<EmphasizedText>1</EmphasizedText> 이 되고 이후 서서히 회복
					</li>
				</ul>
			</li>
			<li>
				맵 곳곳에 등장하는 구슬을 먹으면 <EmphasizedText>최종 데미지</EmphasizedText>가 증가합니다.
			</li>
		</ul>
	)
}

/** 길드 수련장 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildTrainingInfoSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildTrainingInfoSummary
