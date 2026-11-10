import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterLabel, { type MonsterLabelProps } from '@/features/tips/components/shared/monster-label'
import { WORLD_BOSS_META, WORLD_BOSS_TIME_LIMIT_SEC } from '@/features/tips/lib/world-boss.constants'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const KING_CASTLE_GOLEM_LABEL = {
	src: WORLD_BOSS_META.imageSrc,
	name: WORLD_BOSS_META.label,
	width: WORLD_BOSS_META.imageWidth,
	height: WORLD_BOSS_META.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				제한시간 <EmphasizedText>{WORLD_BOSS_TIME_LIMIT_SEC}초</EmphasizedText> 안에{' '}
				<MonsterLabel {...KING_CASTLE_GOLEM_LABEL} />을 처치하세요.
			</li>
		</ul>
	)
}

/** 월드보스 제한시간 규칙 요약. */
function WorldBossSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default WorldBossSummary
