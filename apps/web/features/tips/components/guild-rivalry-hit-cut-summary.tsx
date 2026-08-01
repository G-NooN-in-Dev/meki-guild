import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

import {
	GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT,
	GUILD_RIVALRY_BUFF_STACK_PER_MOB,
	GUILD_RIVALRY_BUFF_STACK_PER_STAGE,
	GUILD_RIVALRY_HIT_BONUS_MAX_DIFF,
	GUILD_RIVALRY_MOBS_PER_STAGE
} from '@/features/tips/lib/guild-rivalry-hit-cut.constants'

const emphasizedTextClassName = 'text-grayscale-900 font-medium'

/** 대항전 명중·스택 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function GuildRivalryHitCutSummary() {
	return (
		<Card size="sm" className="border-grayscale-200 shadow-soft">
			<CardHeader>
				<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">규칙 요약</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
					<li>
						보스 등장 전 잡몹이 <span className={emphasizedTextClassName}>{GUILD_RIVALRY_MOBS_PER_STAGE}마리</span>{' '}
						나오며, 마리당 <span className={emphasizedTextClassName}>+{GUILD_RIVALRY_BUFF_STACK_PER_MOB}</span> 스택을
						얻어 단계마다 <span className={emphasizedTextClassName}>+{GUILD_RIVALRY_BUFF_STACK_PER_STAGE}</span>{' '}
						증가합니다
					</li>
					<li>
						보스 몬스터의 공격을 받으면 스택이{' '}
						<span className={emphasizedTextClassName}>−{GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT}</span> 감소합니다.
					</li>
					<li>
						명중이 필요 수치보다 높으면 최대{' '}
						<span className={emphasizedTextClassName}>{GUILD_RIVALRY_HIT_BONUS_MAX_DIFF}</span> 차이까지{' '}
						<span className={emphasizedTextClassName}>최종 데미지</span>가 증가합니다
					</li>
					<li>
						보스 몬스터를 <span className={emphasizedTextClassName}>막타</span>칠 때 남아 있던{' '}
						<span className={emphasizedTextClassName}>보스 체력</span>에 따라{' '}
						<span className={emphasizedTextClassName}>점수</span>가 증가합니다
					</li>
				</ul>
			</CardContent>
		</Card>
	)
}

export default GuildRivalryHitCutSummary
