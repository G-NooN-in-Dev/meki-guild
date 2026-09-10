import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import {
	GUILD_EXPEDITION_LATE_TIER_START_STAGE,
	GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC,
	GUILD_EXPEDITION_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-expedition-hit-cut.constants'

function EmphasizedText({ children }: { children: React.ReactNode }) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>
				제한시간 <EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_SEC}초</EmphasizedText> 가 주어집니다. 제한시간 내에
				단계를 클리어하면 제한시간이 <EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC}초</EmphasizedText> 씩
				충전됩니다.
			</li>
			<li>
				<EmphasizedText>{GUILD_EXPEDITION_LATE_TIER_START_STAGE}단계</EmphasizedText>부터는 제한시간 내에 단계를
				클리어해도 제한시간이 <EmphasizedText>충전되지 않습니다</EmphasizedText>.
			</li>
		</ul>
	)
}

/** 토벌전 명중·제한시간 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildExpeditionHitCutSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildExpeditionHitCutSummary
