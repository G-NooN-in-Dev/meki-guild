import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { type ReactNode } from 'react'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import MonsterLabel, { type MonsterLabelProps } from '@/features/tips/components/shared/monster-label'

import {
	GUILD_TRAINING_NORMAL_DEATH_STATE_RECOVERY_SEC,
	GUILD_TRAINING_NORMAL_MOB,
	GUILD_TRAINING_NORMAL_MOB_COUNT,
	GUILD_TRAINING_NORMAL_MOB_SPAWN_COOLDOWN_SEC,
	GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC,
	GUILD_TRAINING_SPECIAL_MOB_5_OCLOCK,
	GUILD_TRAINING_SPECIAL_MOB_7_OCLOCK,
	GUILD_TRAINING_SPECIAL_MOB_11_OCLOCK,
	GUILD_TRAINING_SPECIAL_MOB_COUNT,
	GUILD_TRAINING_SPECIAL_MOB_SPAWN_COOLDOWN_SEC,
	GUILD_TRAINING_TIME_BONUS_KILL_INTERVAL,
	GUILD_TRAINING_TIME_BONUS_SEC,
	GUILD_TRAINING_TIME_LIMIT_SEC
} from '../../lib/guild-training.constants'

const HEAD_CLASS_NAME = 'h-auto px-1.5 py-2 text-center text-xs leading-tight break-keep xs:px-2 sm:px-3 sm:text-sm'

/** 위치는 짧게, 이름·효과에 폭을 더 줍니다. */
const COLUMN_WIDTH_CLASS_NAME = {
	position: 'w-[16%] md:w-[14%]',
	name: 'w-[36%] md:w-[30%]',
	effect: 'w-[48%] md:w-[56%]'
} as const

const NORMAL_MOB_LABEL = {
	src: GUILD_TRAINING_NORMAL_MOB.imageSrc,
	name: GUILD_TRAINING_NORMAL_MOB.label,
	width: GUILD_TRAINING_NORMAL_MOB.imageWidth,
	height: GUILD_TRAINING_NORMAL_MOB.imageHeight
} as const satisfies MonsterLabelProps

const SPECIAL_MOB_5_OCLOCK_LABEL = {
	src: GUILD_TRAINING_SPECIAL_MOB_5_OCLOCK.imageSrc,
	name: GUILD_TRAINING_SPECIAL_MOB_5_OCLOCK.label,
	width: GUILD_TRAINING_SPECIAL_MOB_5_OCLOCK.imageWidth,
	height: GUILD_TRAINING_SPECIAL_MOB_5_OCLOCK.imageHeight
} as const satisfies MonsterLabelProps

const SPECIAL_MOB_7_OCLOCK_LABEL = {
	src: GUILD_TRAINING_SPECIAL_MOB_7_OCLOCK.imageSrc,
	name: GUILD_TRAINING_SPECIAL_MOB_7_OCLOCK.label,
	width: GUILD_TRAINING_SPECIAL_MOB_7_OCLOCK.imageWidth,
	height: GUILD_TRAINING_SPECIAL_MOB_7_OCLOCK.imageHeight,
	unoptimized: true
} as const satisfies MonsterLabelProps

const SPECIAL_MOB_11_OCLOCK_LABEL = {
	src: GUILD_TRAINING_SPECIAL_MOB_11_OCLOCK.imageSrc,
	name: GUILD_TRAINING_SPECIAL_MOB_11_OCLOCK.label,
	width: GUILD_TRAINING_SPECIAL_MOB_11_OCLOCK.imageWidth,
	height: GUILD_TRAINING_SPECIAL_MOB_11_OCLOCK.imageHeight
} as const satisfies MonsterLabelProps

type SpecialMobEffectRow = {
	position: string
	label: MonsterLabelProps
	effect: ReactNode
}

/** 특수몹 처치 효과 3행. 위치·이름·효과를 한 표로 맞춥니다. */
const SPECIAL_MOB_EFFECT_ROWS = [
	{
		position: '5시 방향',
		label: SPECIAL_MOB_5_OCLOCK_LABEL,
		effect: (
			<>
				<EmphasizedText>{GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC}초</EmphasizedText>간{' '}
				<EmphasizedText>공격 속도</EmphasizedText>·<EmphasizedText>이동 속도</EmphasizedText>·
				<EmphasizedText>기본 공격 데미지</EmphasizedText> 증가
			</>
		)
	},
	{
		position: '7시 방향',
		label: SPECIAL_MOB_7_OCLOCK_LABEL,
		effect: (
			<>
				<EmphasizedText>{GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC}초</EmphasizedText>간{' '}
				<EmphasizedText>최종 데미지</EmphasizedText> 증가
			</>
		)
	},
	{
		position: '11시 방향',
		label: SPECIAL_MOB_11_OCLOCK_LABEL,
		effect: (
			<>
				모든 <MonsterLabel {...NORMAL_MOB_LABEL} />의 체력이{' '}
				<EmphasizedText>{GUILD_TRAINING_NORMAL_DEATH_STATE_RECOVERY_SEC}초</EmphasizedText> 동안{' '}
				<EmphasizedText>1</EmphasizedText>이 되고 이후 서서히 회복
			</>
		)
	}
] as const satisfies readonly SpecialMobEffectRow[]

/**
 * 표 이름 칸 전용.
 * xs 미만은 공백 앞에서 2줄로 강제하고, xs 이상은 한 줄입니다.
 * 스프라이트 가로비가 달라도 같은 슬롯 폭을 쓰게 해 텍스트 간격이 일정해 보이게 합니다.
 */
/** 표 칸용. 이름은 EmphasizedText 대신 줄바꿈 레이아웃을 쓰고, 스프라이트만 MonsterLabel을 재사용합니다. */
function SpecialMobNameCell({ src, name, width, height, unoptimized = false }: MonsterLabelProps & { name: string }) {
	const spaceIndex = name.indexOf(' ')
	const firstLine = spaceIndex === -1 ? name : name.slice(0, spaceIndex)
	const secondLine = spaceIndex === -1 ? null : name.slice(spaceIndex + 1)

	return (
		<span className="inline-flex items-center gap-1.5">
			<span className="inline-flex h-7 w-7 shrink-0 items-center justify-center">
				<MonsterLabel
					src={src}
					width={width}
					height={height}
					unoptimized={unoptimized}
					imageClassName="my-0 h-7 w-auto max-w-full self-auto object-contain"
				/>
			</span>
			<span className="text-grayscale-900 text-left font-medium break-keep">
				<span className="xs:hidden">
					<span className="block leading-tight">{firstLine}</span>
					{secondLine ? <span className="block leading-tight">{secondLine}</span> : null}
				</span>
				<span className="xs:inline hidden whitespace-nowrap">{name}</span>
			</span>
		</span>
	)
}

/**
 * 길드 수련장 규칙 요약.
 */
function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				기본 제한시간 <EmphasizedText>{GUILD_TRAINING_TIME_LIMIT_SEC}초</EmphasizedText>가 주어집니다.
			</li>
			<li>
				<MonsterLabel {...NORMAL_MOB_LABEL} /> <EmphasizedText>{GUILD_TRAINING_NORMAL_MOB_COUNT} 마리</EmphasizedText>
				와, 특수몹 <EmphasizedText>{GUILD_TRAINING_SPECIAL_MOB_COUNT} 마리</EmphasizedText>가 소환됩니다.
			</li>
			<li>
				<MonsterLabel {...NORMAL_MOB_LABEL} />을{' '}
				<EmphasizedText>{GUILD_TRAINING_TIME_BONUS_KILL_INTERVAL} 마리</EmphasizedText> 처치할 때마다 제한시간이{' '}
				<EmphasizedText>{GUILD_TRAINING_TIME_BONUS_SEC}초</EmphasizedText> 증가합니다.
			</li>
			<li>
				처치된 <MonsterLabel {...NORMAL_MOB_LABEL} />은{' '}
				<EmphasizedText>{GUILD_TRAINING_NORMAL_MOB_SPAWN_COOLDOWN_SEC}초</EmphasizedText>, 특수몹은{' '}
				<EmphasizedText>{GUILD_TRAINING_SPECIAL_MOB_SPAWN_COOLDOWN_SEC}초</EmphasizedText> 후 다음 레벨로 소환됩니다.
			</li>
			<li>
				맵 곳곳에 등장하는 구슬을 먹으면 <EmphasizedText>최종 데미지</EmphasizedText>가 증가합니다.
			</li>
		</ul>
	)
}

/** 특수몹 처치 효과 — 위치 / 이름 / 효과 */
function SpecialMobEffectTable() {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-grayscale-900 text-sm font-semibold md:text-base">특수몹 처치 효과</p>
			<HitCutTableShell scrollable={false} className="shadow-none">
				<TableHeader>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead
							className={cn(HEAD_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600', COLUMN_WIDTH_CLASS_NAME.position)}
						>
							위치
						</TableHead>
						<TableHead
							className={cn(HEAD_CLASS_NAME, 'bg-pastel-blue-100 text-pastel-blue-900', COLUMN_WIDTH_CLASS_NAME.name)}
						>
							이름
						</TableHead>
						<TableHead
							className={cn(
								HEAD_CLASS_NAME,
								'bg-pastel-green-100 text-pastel-green-900',
								COLUMN_WIDTH_CLASS_NAME.effect
							)}
						>
							효과
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{SPECIAL_MOB_EFFECT_ROWS.map(({ position, label, effect }) => (
						<TableRow key={position} className="border-grayscale-200 hover:bg-transparent">
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									'bg-grayscale-50 text-grayscale-800 break-keep whitespace-normal',
									COLUMN_WIDTH_CLASS_NAME.position
								)}
							>
								{position}
							</TableCell>
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									'bg-pastel-blue-50 text-grayscale-900 xs:px-3 px-2 text-left font-medium',
									COLUMN_WIDTH_CLASS_NAME.name
								)}
							>
								<SpecialMobNameCell {...label} />
							</TableCell>
							<TableCell
								className={cn(
									HIT_CUT_CELL_BASE_CLASS_NAME,
									'bg-pastel-green-50 text-grayscale-700 xs:px-3 px-2 text-left font-normal break-keep whitespace-normal',
									COLUMN_WIDTH_CLASS_NAME.effect
								)}
							>
								{effect}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</HitCutTableShell>
		</div>
	)
}

/** 길드 수련장 규칙 요약 카드. 표에 안 나오는 배경 규칙과 특수몹 효과를 모읍니다. */
function GuildTrainingSummary() {
	return (
		<HitCutSummaryCard>
			<div className="flex flex-col gap-4">
				<SummaryRulesList />
				<SpecialMobEffectTable />
			</div>
		</HitCutSummaryCard>
	)
}

export default GuildTrainingSummary
