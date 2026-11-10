import { Badge } from '@shared/ui/badge'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { type ReactNode } from 'react'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import MonsterLabel, { type MonsterLabelProps } from '@/features/tips/components/shared/monster-label'
import {
	getGuildBountyCompanionTimings,
	GUILD_BOUNTY_ATTACK_EFFECT_META,
	GUILD_BOUNTY_ATTACKS,
	GUILD_BOUNTY_BOSS_ENRAGE_HP_PERCENT,
	GUILD_BOUNTY_BUFF_ORB_COUNT,
	GUILD_BOUNTY_BUFF_ORB_DESPAWN_SEC,
	GUILD_BOUNTY_BUFF_ORB_FIRST_SPAWN_SEC,
	GUILD_BOUNTY_BUFF_ORB_INTERVAL_SEC,
	GUILD_BOUNTY_BUFF_ORB_REMAINING_LABELS,
	GUILD_BOUNTY_BUFF_ORBS,
	GUILD_BOUNTY_COMPANION_FIRST_AVAILABLE_SEC,
	GUILD_BOUNTY_COMPANION_INTERVAL_SEC,
	GUILD_BOUNTY_COMPANION_MAX_COUNT,
	GUILD_BOUNTY_HARD_MONSTER,
	GUILD_BOUNTY_HARD_STAGE_INTERVAL,
	GUILD_BOUNTY_NORMAL_MONSTER,
	GUILD_BOUNTY_TIME_LIMIT_SEC
} from '@/features/tips/lib/guild-bounty.constants'
import type { GuildBountyAttackEffectId, GuildBountyBuffOrbSideId } from '@/features/tips/types/guild-bounty.type'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const NORMAL_MONSTER_LABEL = {
	src: GUILD_BOUNTY_NORMAL_MONSTER.imageSrc,
	name: GUILD_BOUNTY_NORMAL_MONSTER.label,
	width: GUILD_BOUNTY_NORMAL_MONSTER.imageWidth,
	height: GUILD_BOUNTY_NORMAL_MONSTER.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

const HARD_MONSTER_LABEL = {
	src: GUILD_BOUNTY_HARD_MONSTER.imageSrc,
	name: GUILD_BOUNTY_HARD_MONSTER.label,
	width: GUILD_BOUNTY_HARD_MONSTER.imageWidth,
	height: GUILD_BOUNTY_HARD_MONSTER.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

const COMPANION_TIMINGS = getGuildBountyCompanionTimings()

/** 버프 구슬 효과 문구. 강조할 키워드만 EmphasizedText로 감쌉니다. */
const GUILD_BOUNTY_BUFF_ORB_EFFECTS = {
	left: {
		description: (
			<>
				구슬을 먹은 뒤에 소환되는 동료의 <EmphasizedText>피해량</EmphasizedText>이 증가합니다. 효과는{' '}
				<EmphasizedText>누적</EmphasizedText>됩니다.
			</>
		)
	},
	right: {
		description: (
			<>
				불꽃늑대를 <EmphasizedText>기절</EmphasizedText>시키고 <EmphasizedText>피해량</EmphasizedText>을 증가시킵니다.{' '}
				<EmphasizedText>먼저 먹을수록</EmphasizedText> 피해량 증가가 더 큽니다.
			</>
		)
	}
} as const satisfies Record<GuildBountyBuffOrbSideId, { description: ReactNode }>

const ATTACK_HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

const ATTACK_COLUMN_WIDTH_CLASS_NAME = {
	name: 'w-[46%] md:w-[44%]',
	effects: 'w-[54%] md:w-[56%]'
} as const

type AttackEffectBadgesProps = {
	effects: readonly GuildBountyAttackEffectId[]
}

/** 한 공격의 디버프를 Badge로 나열합니다. */
function AttackEffectBadges({ effects }: AttackEffectBadgesProps) {
	return (
		<span className="flex flex-wrap items-center justify-center gap-1">
			{effects.map((effectId) => {
				const { label, badgeClassName } = GUILD_BOUNTY_ATTACK_EFFECT_META[effectId]

				return (
					<Badge
						key={effectId}
						className={cn('px-1.5 py-0 text-[10px] font-medium whitespace-nowrap md:text-xs', badgeClassName)}
					>
						{label}
					</Badge>
				)
			})}
		</span>
	)
}

function AttackPatternsTable() {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-grayscale-900 text-sm font-semibold md:text-base">공격 패턴</p>
			<HitCutTableShell scrollable={false}>
				<TableHeader>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead
							className={cn(
								ATTACK_HEAD_CLASS_NAME,
								'bg-pastel-blue-100 text-pastel-blue-900',
								ATTACK_COLUMN_WIDTH_CLASS_NAME.name
							)}
						>
							공격
						</TableHead>
						<TableHead
							className={cn(
								ATTACK_HEAD_CLASS_NAME,
								'bg-pastel-green-100 text-pastel-green-900',
								ATTACK_COLUMN_WIDTH_CLASS_NAME.effects
							)}
						>
							효과
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{GUILD_BOUNTY_ATTACKS.map(({ id, name, effects }) => (
						<TableRow key={id} className="border-grayscale-200 hover:bg-transparent">
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									'text-grayscale-900 font-medium break-keep whitespace-normal',
									ATTACK_COLUMN_WIDTH_CLASS_NAME.name
								)}
							>
								{name}
							</TableCell>
							<TableCell
								className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1 font-normal', ATTACK_COLUMN_WIDTH_CLASS_NAME.effects)}
							>
								<AttackEffectBadges effects={effects} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</HitCutTableShell>
		</div>
	)
}

function SummaryRulesList() {
	return (
		<div className="flex flex-col gap-4 md:gap-5">
			<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
				<li>
					제한시간 <EmphasizedText>{GUILD_BOUNTY_TIME_LIMIT_SEC}초</EmphasizedText> 동안{' '}
					<MonsterLabel {...NORMAL_MONSTER_LABEL} />를 처치하세요.
				</li>
				<li>
					<EmphasizedText>{GUILD_BOUNTY_HARD_STAGE_INTERVAL}단계</EmphasizedText>마다 어려운 모드가 등장하며,{' '}
					<MonsterLabel {...HARD_MONSTER_LABEL} />를 처치해야 합니다.
				</li>
				<li>
					보스의 체력이 <EmphasizedText>{GUILD_BOUNTY_BOSS_ENRAGE_HP_PERCENT}%</EmphasizedText> 이하가 되면 보스의{' '}
					<EmphasizedText>공격력·방어력</EmphasizedText>이 증가하지만, <EmphasizedText>동료의 공격</EmphasizedText>
					에는 약해집니다.
				</li>
			</ul>

			<div className="flex flex-col gap-2">
				<p className="text-grayscale-900 text-sm font-semibold md:text-base">동료 소환</p>
				<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
					<li>
						동료는 총 <EmphasizedText>{GUILD_BOUNTY_COMPANION_MAX_COUNT}명</EmphasizedText>까지 소환할 수 있습니다.
					</li>
					<li>
						첫 동료는 시작 <EmphasizedText>{GUILD_BOUNTY_COMPANION_FIRST_AVAILABLE_SEC}초</EmphasizedText> 뒤, 이후{' '}
						<EmphasizedText>{GUILD_BOUNTY_COMPANION_INTERVAL_SEC}초</EmphasizedText>마다 소환할 수 있습니다.
					</li>
					<li>
						<EmphasizedText>자동 소환 설정 시</EmphasizedText> 동료가 소환되는 시간은 아래와 같습니다.
					</li>
				</ul>
				<ol className="text-grayscale-700 flex list-none flex-wrap items-center gap-x-1.5 gap-y-1.5 p-0 text-sm md:text-base">
					{COMPANION_TIMINGS.map(({ order, remainingLabel }, index) => {
						const isLast = index === COMPANION_TIMINGS.length - 1

						return (
							<li key={order} className="flex items-center gap-1.5">
								<span className="bg-grayscale-100 text-grayscale-800 rounded-md px-2 py-1 break-keep">
									{order}번째 · {remainingLabel}
								</span>
								{isLast ? null : (
									<span className="text-grayscale-400" aria-hidden>
										{'→'}
									</span>
								)}
							</li>
						)
					})}
				</ol>
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-grayscale-900 text-sm font-semibold md:text-base">버프 구슬</p>
				<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
					<li>
						버프 구슬은 총 <EmphasizedText>{GUILD_BOUNTY_BUFF_ORB_COUNT}번</EmphasizedText> 생성되며, 플레이어의 현재
						위치 기준 <EmphasizedText>좌·우</EmphasizedText>에 나타납니다.
					</li>
					<li>
						첫 구슬은 시작 <EmphasizedText>{GUILD_BOUNTY_BUFF_ORB_FIRST_SPAWN_SEC}초</EmphasizedText> 뒤, 이후{' '}
						<EmphasizedText>{GUILD_BOUNTY_BUFF_ORB_INTERVAL_SEC}초</EmphasizedText>마다 생성됩니다.
					</li>
					<li>
						구슬은 <EmphasizedText>{GUILD_BOUNTY_BUFF_ORB_DESPAWN_SEC}초</EmphasizedText> 동안 미획득하면 사라집니다.
					</li>
					<li>구슬이 생성되는 시간과 효과는 아래와 같습니다.</li>
				</ul>
				<ol className="text-grayscale-700 flex list-none flex-wrap items-center gap-x-1.5 gap-y-1.5 p-0 text-sm md:text-base">
					{GUILD_BOUNTY_BUFF_ORB_REMAINING_LABELS.map((remainingLabel, index) => {
						const isLast = index === GUILD_BOUNTY_BUFF_ORB_REMAINING_LABELS.length - 1

						return (
							<li key={remainingLabel} className="flex items-center gap-1.5">
								<span className="bg-grayscale-100 text-grayscale-800 rounded-md px-2 py-1 break-keep">
									{index + 1}번째 · {remainingLabel}
								</span>
								{isLast ? null : (
									<span className="text-grayscale-400" aria-hidden>
										{'→'}
									</span>
								)}
							</li>
						)
					})}
				</ol>
				<ul className="flex flex-col gap-2">
					{GUILD_BOUNTY_BUFF_ORBS.map(({ id, sideLabel, badgeClassName }) => (
						<li
							key={id}
							className="border-grayscale-200 bg-grayscale-50 flex flex-col gap-1.5 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-start sm:gap-3"
						>
							<Badge
								className={cn('shrink-0 self-start px-1.5 py-0 text-[10px] font-medium md:text-xs', badgeClassName)}
							>
								{sideLabel} 구슬
							</Badge>
							<p className="text-grayscale-700 text-sm break-keep md:text-base">
								{GUILD_BOUNTY_BUFF_ORB_EFFECTS[id].description}
							</p>
						</li>
					))}
				</ul>
			</div>

			<AttackPatternsTable />
		</div>
	)
}

/** 현상수배 제한시간·동료·버프 구슬·공격 패턴 규칙 요약 */
function GuildBountySummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default GuildBountySummary
