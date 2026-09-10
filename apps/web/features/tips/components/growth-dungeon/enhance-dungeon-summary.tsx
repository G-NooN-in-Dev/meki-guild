import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import {
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT,
	ENHANCE_DUNGEON_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

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

/** 강화 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function EnhanceDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default EnhanceDungeonSummary
