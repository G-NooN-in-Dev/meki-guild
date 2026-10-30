import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterNameLabel, { type MonsterNameLabelProps } from '@/features/tips/components/shared/monster-name-label'
import {
	EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_HIT_CUT_BONUS,
	EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_SPEED_BUFF_SEC,
	EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_TIME_BONUS_SEC,
	EXPERIENCE_DUNGEON_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

/** 가로로 긴 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const JUNIOR_BOOGIE_LABEL = {
	src: '/monsters/junior-boogie.gif',
	name: '주니어 부기',
	width: 56,
	height: 36,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				제한시간 <EmphasizedText>{EXPERIENCE_DUNGEON_TIME_LIMIT_SEC}초</EmphasizedText> 안에 정해진 수의 몬스터를
				처치하세요.
			</li>
			<li>
				<MonsterNameLabel {...JUNIOR_BOOGIE_LABEL} />를 처치하면 제한시간이{' '}
				<EmphasizedText>{EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_TIME_BONUS_SEC}초</EmphasizedText> 충전되고,{' '}
				<EmphasizedText>{EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_SPEED_BUFF_SEC}초</EmphasizedText> 간 이동속도와 공격속도가
				증가합니다.
			</li>
			<li>
				<MonsterNameLabel {...JUNIOR_BOOGIE_LABEL} />의 필요 명중은 일반 몬스터보다{' '}
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
