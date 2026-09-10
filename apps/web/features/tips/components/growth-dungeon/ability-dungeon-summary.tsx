import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import {
	ABILITY_DUNGEON_ATTACK_BUFF_MAX_STACKS,
	ABILITY_DUNGEON_ATTACK_BUFF_PERCENT_PER_KILL,
	ABILITY_DUNGEON_BOSS_TIME_LIMIT_SEC,
	ABILITY_DUNGEON_NORMAL_HIT_CUT_BONUS,
	ABILITY_DUNGEON_NORMAL_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{ABILITY_DUNGEON_NORMAL_TIME_LIMIT_SEC}초</EmphasizedText> 동안 일반 몬스터를
				사냥하세요.
			</li>
			<li>
				이후 제한시간 <EmphasizedText>{ABILITY_DUNGEON_BOSS_TIME_LIMIT_SEC}초</EmphasizedText> 안에 보스 몬스터를
				처치하세요.
			</li>
			<li>
				일반 몬스터 1마리당 공격력 <EmphasizedText>{ABILITY_DUNGEON_ATTACK_BUFF_PERCENT_PER_KILL}%</EmphasizedText> 증가
				버프가 쌓이며, 최대 <EmphasizedText>{ABILITY_DUNGEON_ATTACK_BUFF_MAX_STACKS}</EmphasizedText> 스택까지
				적용됩니다.
			</li>
			<li>
				일반 몬스터의 명중컷은 보스 몬스터보다 <EmphasizedText>{ABILITY_DUNGEON_NORMAL_HIT_CUT_BONUS}</EmphasizedText>{' '}
				높습니다.
			</li>
		</ul>
	)
}

/** 용사의 수련장 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function AbilityDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default AbilityDungeonSummary
