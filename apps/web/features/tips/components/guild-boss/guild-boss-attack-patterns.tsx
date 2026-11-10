import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import MonsterLabel from '@/features/tips/components/shared/monster-label'
import {
	getGuildBossProgressStepLabel,
	GUILD_BOSS,
	GUILD_BOSS_ATTACK_DIRECTION_LABEL,
	GUILD_BOSS_ATTACK_EFFECT_META,
	GUILD_BOSS_PROGRESSION,
	GUILD_BOSS_PROGRESSION_REPEAT_COUNT
} from '@/features/tips/lib/guild-boss.constants'
import type { GuildBossAttack, GuildBossAttackEffectId } from '@/features/tips/types/guild-boss.type'

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/**
 * 표 열 너비.
 * 범위·효과 칸이 안 깨지도록 비율을 잡습니다.
 */
const COLUMN_WIDTH_CLASS_NAME = {
	name: 'w-[34%] md:w-[32%]',
	range: 'w-[22%] md:w-[20%]',
	effects: 'w-[44%] md:w-[48%]'
} as const

type AttackEffectBadgesProps = {
	effects: readonly GuildBossAttackEffectId[]
}

/** 한 방향 공격의 피해·디버프를 Badge로 나열합니다. 없으면 대시. */
function AttackEffectBadges({ effects }: AttackEffectBadgesProps) {
	if (effects.length === 0) {
		return <span className="text-grayscale-400">—</span>
	}

	return (
		<span className="flex flex-wrap items-center justify-center gap-1">
			{effects.map((effectId) => {
				const { label, badgeClassName } = GUILD_BOSS_ATTACK_EFFECT_META[effectId]

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

type AttackRowProps = {
	attack: GuildBossAttack
}

function AttackRow({ attack }: AttackRowProps) {
	const { name, direction, source, effects } = attack

	return (
		<TableRow className="border-grayscale-200 hover:bg-transparent">
			<TableCell
				className={cn(
					HIT_CUT_CELL_BASE_CLASS_NAME,
					'text-grayscale-900 text-left font-medium break-keep whitespace-normal',
					COLUMN_WIDTH_CLASS_NAME.name
				)}
			>
				<span className="flex flex-col gap-0.5">
					<span>{name}</span>
					{source ? <span className="text-grayscale-500 text-[10px] font-normal md:text-xs">{source}</span> : null}
				</span>
			</TableCell>
			<TableCell
				className={cn(
					HIT_CUT_CELL_BASE_CLASS_NAME,
					'text-grayscale-700 font-normal whitespace-nowrap',
					COLUMN_WIDTH_CLASS_NAME.range
				)}
			>
				{GUILD_BOSS_ATTACK_DIRECTION_LABEL[direction]}
			</TableCell>
			<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1 font-normal', COLUMN_WIDTH_CLASS_NAME.effects)}>
				<AttackEffectBadges effects={effects} />
			</TableCell>
		</TableRow>
	)
}

/** 화살표로 이어 붙인 진행 순서. 패턴은 정해진 횟수만큼 반복합니다. */
function ProgressionFlow() {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-grayscale-900 text-sm font-semibold md:text-base">
				진행 순서
				<span className="text-grayscale-500 ml-1.5 text-xs font-normal md:text-sm">
					({GUILD_BOSS_PROGRESSION_REPEAT_COUNT}번 반복)
				</span>
			</p>
			<ol className="flex list-none flex-wrap items-center gap-x-1.5 gap-y-1.5 p-0 text-sm md:text-base">
				{GUILD_BOSS_PROGRESSION.map((step, index) => {
					const isLast = index === GUILD_BOSS_PROGRESSION.length - 1

					return (
						<li key={`${step.id}-${index}`} className="flex items-center gap-1.5">
							<span className="bg-grayscale-100 text-grayscale-800 rounded-md px-2 py-1 break-keep">
								{getGuildBossProgressStepLabel(step)}
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
	)
}

function AttackPatternsBody() {
	const { label, imageSrc, imageWidth, imageHeight, attacks } = GUILD_BOSS

	return (
		<div className="flex flex-col gap-4 md:gap-5">
			{/* 표에는 방향별 효과만 있고, 피격 누적 규칙은 여기에만 둡니다. */}
			<p className="text-grayscale-600 text-sm break-keep md:text-base">
				좌·우·아래 공격을 받을수록 <EmphasizedText>HP·MP 감소량</EmphasizedText>이 증가합니다.
			</p>

			<ProgressionFlow />

			<Card size="sm" className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0">
				<CardHeader className="flex flex-row items-center gap-3 px-4 py-3 md:gap-4 md:px-5 md:py-4">
					<MonsterLabel src={imageSrc} alt={label} width={imageWidth} height={imageHeight} unoptimized size="card" />
					<div className="flex min-w-0 flex-col gap-0.5">
						<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">{label}</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="px-0 pb-0">
					<HitCutTableShell scrollable={false} className="rounded-none border-x-0 border-b-0 shadow-none">
						<TableHeader>
							<TableRow className="border-grayscale-200 hover:bg-transparent">
								<TableHead
									className={cn(
										HEAD_CLASS_NAME,
										'bg-pastel-blue-100 text-pastel-blue-900',
										COLUMN_WIDTH_CLASS_NAME.name
									)}
								>
									공격
								</TableHead>
								<TableHead
									className={cn(
										HEAD_CLASS_NAME,
										'bg-pastel-orange-100 text-pastel-orange-900',
										COLUMN_WIDTH_CLASS_NAME.range
									)}
								>
									<span className="flex flex-col items-center gap-0.5">
										<span>방향</span>
										<span className={HEAD_HINT_CLASS_NAME}>(좌 / 우 / 아래)</span>
									</span>
								</TableHead>
								<TableHead
									className={cn(
										HEAD_CLASS_NAME,
										'bg-pastel-green-100 text-pastel-green-900',
										COLUMN_WIDTH_CLASS_NAME.effects
									)}
								>
									효과
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{attacks.map((attack) => (
								<AttackRow key={attack.id} attack={attack} />
							))}
						</TableBody>
					</HitCutTableShell>
				</CardContent>
			</Card>
		</div>
	)
}

/**
 * 보스대전 진행 순서·방향별 공격 패턴.
 * 단계 표가 없어 기본을 펼쳐 두고, 모바일에서도 바로 확인할 수 있게 합니다.
 */
function GuildBossAttackPatterns() {
	return (
		<Card size="sm" className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0">
			<Collapsible defaultOpen className="flex flex-col">
				<CollapsibleTrigger
					className={cn(
						'group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left md:py-4',
						'text-grayscale-900 text-base font-semibold md:text-lg',
						'focus-visible:ring-grayscale-900 rounded-md focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					진행 순서 · 공격 패턴
					<ChevronDownIcon
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-grayscale-200 border-t px-4 py-3 md:py-4">
						<AttackPatternsBody />
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}

export default GuildBossAttackPatterns
