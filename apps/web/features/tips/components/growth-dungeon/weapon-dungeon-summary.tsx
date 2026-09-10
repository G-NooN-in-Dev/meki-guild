import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import { WEAPON_DUNGEON_TIME_LIMIT_SEC } from '@/features/tips/lib/growth-dungeon.constants'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{WEAPON_DUNGEON_TIME_LIMIT_SEC}초</EmphasizedText> 안에{' '}
				<EmphasizedText>머쉬맘</EmphasizedText>을 처치하세요.
			</li>
		</ul>
	)
}

/** 무기 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. 모바일은 접고, md 이상은 펼칩니다. */
function WeaponDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default WeaponDungeonSummary
