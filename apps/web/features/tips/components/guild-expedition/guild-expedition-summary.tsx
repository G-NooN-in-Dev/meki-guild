import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterLabel, { type MonsterLabelProps } from '@/features/tips/components/shared/monster-label'
import {
	GUILD_EXPEDITION_BOSS,
	GUILD_EXPEDITION_LATE_TIER_START_STAGE,
	GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC,
	GUILD_EXPEDITION_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-expedition.constants'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const ARCANUS_LABEL = {
	src: GUILD_EXPEDITION_BOSS.imageSrc,
	name: GUILD_EXPEDITION_BOSS.label,
	width: GUILD_EXPEDITION_BOSS.imageWidth,
	height: GUILD_EXPEDITION_BOSS.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				기본 제한시간 <EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_SEC}초</EmphasizedText>가 주어집니다.
			</li>
			<li>
				제한시간 내에 <MonsterLabel {...ARCANUS_LABEL} />를 처치하면 남은 시간에{' '}
				<EmphasizedText>{GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC}초</EmphasizedText>가 충전됩니다.
			</li>
			<li>
				<EmphasizedText>{GUILD_EXPEDITION_LATE_TIER_START_STAGE}단계</EmphasizedText>부터는{' '}
				<MonsterLabel {...ARCANUS_LABEL} />를 처치해도 제한시간이 충전되지 않습니다.
			</li>
		</ul>
	)
}

/** 토벌전 보스·제한시간 규칙 요약. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildExpeditionSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildExpeditionSummary
