import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import {
	EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_HIT_CUT_BONUS,
	EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_TIME_BONUS_SEC,
	EXPERIENCE_DUNGEON_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{EXPERIENCE_DUNGEON_TIME_LIMIT_SEC}초</EmphasizedText> 안에 정해진 수의 몬스터를
				처치하세요.
			</li>
			<li>
				<EmphasizedText>주니어 부기</EmphasizedText>를 처치하면 제한시간이{' '}
				<EmphasizedText>{EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_TIME_BONUS_SEC}초</EmphasizedText> 충전됩니다.
			</li>
			<li>
				주니어 부기의 명중컷은 일반 몬스터보다{' '}
				<EmphasizedText>{EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_HIT_CUT_BONUS}</EmphasizedText> 높습니다.
			</li>
		</ul>
	)
}

/** 경험치 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function ExperienceDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default ExperienceDungeonSummary
