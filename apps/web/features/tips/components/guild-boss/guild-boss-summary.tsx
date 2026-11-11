import GuildBossStatsTable from '@/features/tips/components/guild-boss/guild-boss-stats-table'
import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterLabel, { type MonsterLabelProps } from '@/features/tips/components/shared/monster-label'
import {
	GUILD_BOSS,
	GUILD_BOSS_INCOMING_DAMAGE_REDUCTION_PERCENT,
	GUILD_BOSS_STUN_FINAL_DAMAGE_REDUCTION_PERCENT,
	GUILD_BOSS_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-boss.constants'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const BOSS_LABEL = {
	src: GUILD_BOSS.imageSrc,
	name: GUILD_BOSS.label,
	width: GUILD_BOSS.imageWidth,
	height: GUILD_BOSS.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

function SummaryRulesList() {
	return (
		<div className="flex flex-col gap-4 md:gap-5">
			<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
				<li>
					제한시간 <EmphasizedText>{GUILD_BOSS_TIME_LIMIT_SEC}초</EmphasizedText> 동안 <MonsterLabel {...BOSS_LABEL} />
					에게 최대한 많은 피해를 입히세요.
				</li>
				<li>
					보스는 총 2번 자신의 <EmphasizedText>받는 피해</EmphasizedText>를{' '}
					<EmphasizedText>{GUILD_BOSS_INCOMING_DAMAGE_REDUCTION_PERCENT}%</EmphasizedText> 감소시킵니다.
				</li>
				<li>
					기절 중에는 보스가 <EmphasizedText>아래 공격</EmphasizedText>을 하며, 자신의{' '}
					<EmphasizedText>받는 최종 피해</EmphasizedText>를{' '}
					<EmphasizedText>{GUILD_BOSS_STUN_FINAL_DAMAGE_REDUCTION_PERCENT}%</EmphasizedText> 감소시킵니다.
				</li>
				<li>
					<EmphasizedText>좌·우 불 내뿜기</EmphasizedText>를 맞으면 반대편에 <EmphasizedText>버프 구슬</EmphasizedText>
					이 생성됩니다. 구슬을 먹으면 <EmphasizedText>보스 데미지 증가</EmphasizedText> 버프를{' '}
					<EmphasizedText>+1</EmphasizedText> 스택 획득합니다.
				</li>
			</ul>

			<GuildBossStatsTable />
		</div>
	)
}

/** 보스대전 제한시간·명중·방어력·피해 감소·버프 구슬 규칙 요약 */
function GuildBossSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildBossSummary
