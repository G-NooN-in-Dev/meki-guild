import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterNameLabel, { type MonsterNameLabelProps } from '@/features/tips/components/shared/monster-name-label'
import {
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT,
	ENHANCE_DUNGEON_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const CRIMSON_BARLOG_LABEL = {
	src: '/monsters/crimson-barlog.gif',
	name: '발록',
	width: 312,
	height: 304,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				제한시간 <EmphasizedText>{ENHANCE_DUNGEON_TIME_LIMIT_SEC}초</EmphasizedText> 안에{' '}
				<MonsterNameLabel {...CRIMSON_BARLOG_LABEL} />을 처치하세요.
			</li>
			<li>
				<EmphasizedText>{ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT}%</EmphasizedText> 확률로{' '}
				<EmphasizedText>의문의 주문서</EmphasizedText>를 획득할 수 있습니다. 획득 시 단계에 따라{' '}
				<EmphasizedText>노말 · 레어 · 에픽</EmphasizedText>으로 나뉘고, 레어·에픽은 세부 종류로 균등 분배됩니다.
			</li>
		</ul>
	)
}

/** 강화 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function EnhanceDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default EnhanceDungeonSummary
