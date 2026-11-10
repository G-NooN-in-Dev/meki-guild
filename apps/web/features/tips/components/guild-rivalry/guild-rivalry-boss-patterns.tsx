import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import {
	GUILD_RIVALRY_ATTACK_EFFECT_META,
	GUILD_RIVALRY_ATTACK_RANGE_LABEL,
	GUILD_RIVALRY_BOSSES
} from '@/features/tips/lib/guild-rivalry.constants'
import type {
	GuildRivalryAttackEffectId,
	GuildRivalryBoss,
	GuildRivalryBossAttack
} from '@/features/tips/types/guild-rivalry.type'

/** 모든 공격에 공통이라 표에서는 빼고 섹션 안내로만 보여 줍니다. */
const COMMON_ATTACK_EFFECT_ID = 'boss-damage-stack-loss' as const satisfies GuildRivalryAttackEffectId

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/**
 * 표 열 너비.
 * 범위 헤더 힌트(아래 / 좌·우)가 안 깨지도록 범위에 조금 더 줍니다.
 */
const COLUMN_WIDTH_CLASS_NAME = {
	hit: 'w-[12%] md:w-[10%]',
	name: 'w-[30%] md:w-[30%]',
	range: 'w-[22%] md:w-[22%]',
	effects: 'w-[36%] md:w-[38%]'
} as const

/** 공통 피해를 제외한, 타마다 다른 부가 효과만 남깁니다. */
function getUniqueAttackEffects(effects: readonly GuildRivalryAttackEffectId[]) {
	return effects.filter((effectId) => effectId !== COMMON_ATTACK_EFFECT_ID)
}

type AttackEffectBadgesProps = {
	effects: readonly GuildRivalryAttackEffectId[]
}

/** 한 타의 고유 피해·디버프를 Badge로 나열합니다. 없으면 대시. */
function AttackEffectBadges({ effects }: AttackEffectBadgesProps) {
	const uniqueEffects = getUniqueAttackEffects(effects)

	if (uniqueEffects.length === 0) {
		return <span className="text-grayscale-400">—</span>
	}

	return (
		<span className="flex flex-wrap items-center justify-center gap-1">
			{uniqueEffects.map((effectId) => {
				const { label, badgeClassName } = GUILD_RIVALRY_ATTACK_EFFECT_META[effectId]

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

type BossAttackRowProps = {
	attack: GuildRivalryBossAttack
}

function BossAttackRow({ attack }: BossAttackRowProps) {
	const { hit, name, range, effects } = attack

	return (
		<TableRow className="border-grayscale-200 hover:bg-transparent">
			<TableCell
				className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800', COLUMN_WIDTH_CLASS_NAME.hit)}
			>
				{hit}타
			</TableCell>
			<TableCell
				className={cn(
					HIT_CUT_CELL_BASE_CLASS_NAME,
					'text-grayscale-900 text-left font-medium break-keep whitespace-normal',
					COLUMN_WIDTH_CLASS_NAME.name
				)}
			>
				{name}
			</TableCell>
			<TableCell
				className={cn(
					HIT_CUT_CELL_BASE_CLASS_NAME,
					'text-grayscale-700 font-normal whitespace-nowrap',
					COLUMN_WIDTH_CLASS_NAME.range
				)}
			>
				{GUILD_RIVALRY_ATTACK_RANGE_LABEL[range]}
			</TableCell>
			<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1 font-normal', COLUMN_WIDTH_CLASS_NAME.effects)}>
				<AttackEffectBadges effects={effects} />
			</TableCell>
		</TableRow>
	)
}

type BossPatternCardProps = {
	boss: GuildRivalryBoss
	/** 등장 순서 안내 (1부터) */
	order: number
}

/** 보스 한 명의 스프라이트·이름·반복 공격 패턴 표 */
function BossPatternCard({ boss, order }: BossPatternCardProps) {
	const { label, imageSrc, imageWidth, imageHeight, attacks } = boss

	return (
		<Card size="sm" className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0">
			<CardHeader className="flex flex-row items-center gap-3 px-4 py-3 md:gap-4 md:px-5 md:py-4">
				<Image
					src={imageSrc}
					alt={label}
					width={imageWidth}
					height={imageHeight}
					unoptimized
					draggable={false}
					className="h-14 w-auto shrink-0 object-contain mix-blend-darken md:h-16"
				/>
				<div className="flex min-w-0 flex-col gap-0.5">
					<p className="text-grayscale-500 text-xs md:text-sm">{order}번째 보스</p>
					<CardTitle className="text-grayscale-900 text-base font-semibold md:text-lg">{label}</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="px-0 pb-0">
				<HitCutTableShell scrollable={false} className="rounded-none border-x-0 border-b-0 shadow-none">
					<TableHeader>
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead
								className={cn(HEAD_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600', COLUMN_WIDTH_CLASS_NAME.hit)}
							>
								타수
							</TableHead>
							<TableHead
								className={cn(HEAD_CLASS_NAME, 'bg-pastel-blue-100 text-pastel-blue-900', COLUMN_WIDTH_CLASS_NAME.name)}
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
									<span>범위</span>
									<span className={HEAD_HINT_CLASS_NAME}>(아래 / 좌·우)</span>
								</span>
							</TableHead>
							<TableHead
								className={cn(
									HEAD_CLASS_NAME,
									'bg-pastel-green-100 text-pastel-green-900',
									COLUMN_WIDTH_CLASS_NAME.effects
								)}
							>
								추가 피해
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{attacks.map((attack) => (
							<BossAttackRow key={`${boss.id}-${attack.hit}`} attack={attack} />
						))}
					</TableBody>
				</HitCutTableShell>
			</CardContent>
		</Card>
	)
}

function BossPatternsBody() {
	const commonEffectLabel = GUILD_RIVALRY_ATTACK_EFFECT_META[COMMON_ATTACK_EFFECT_ID].label

	return (
		<div className="flex flex-col gap-4 md:gap-5">
			<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
				<li>
					단계별로 <EmphasizedText>아주르 워로드 → 제이드 워로드 → 스칼렛 워로드</EmphasizedText>가 보스로 등장합니다.
				</li>
				<li>각 보스는 정해진 공격 패턴을 가집니다.</li>
				<li>
					모든 공격에는 <EmphasizedText>{commonEffectLabel}</EmphasizedText> 디버프가 적용됩니다.
				</li>
			</ul>

			{GUILD_RIVALRY_BOSSES.map((boss, index) => (
				<BossPatternCard key={boss.id} boss={boss} order={index + 1} />
			))}
		</div>
	)
}
/**
 * 길드 대항전 보스별 공격 패턴·피해 정보.
 * 기본은 접어 두고, 방어력/명중 표로 바로 스크롤할 수 있게 합니다.
 */
function GuildRivalryBossPatterns() {
	return (
		<Card size="sm" className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0">
			<Collapsible className="flex flex-col">
				<CollapsibleTrigger
					className={cn(
						'group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left md:py-4',
						'text-grayscale-900 text-base font-semibold md:text-lg',
						'focus-visible:ring-grayscale-900 rounded-md focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					보스 공격 패턴
					<ChevronDownIcon
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-grayscale-200 border-t px-4 py-3 md:py-4">
						<BossPatternsBody />
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}

export default GuildRivalryBossPatterns
