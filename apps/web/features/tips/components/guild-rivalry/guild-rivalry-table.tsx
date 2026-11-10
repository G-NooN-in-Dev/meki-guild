import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import {
	getGuildRivalryBossByStage,
	GUILD_RIVALRY_BOSS_DEFENSE,
	GUILD_RIVALRY_ENTRIES,
	GUILD_RIVALRY_MOB_DEFENSE
} from '@/features/tips/lib/guild-rivalry.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/** 헤더 보조 문구. 본문보다 한 단계 작게 둡니다. */
const HEAD_HINT_CLASS_NAME = 'text-[10px] leading-none font-normal opacity-80 sm:text-xs'

/** 한 칸 안에서 값을 나누는 기호 */
const SEPARATOR_CLASS_NAME = 'text-grayscale-400 text-[10px] leading-none font-normal'

type RivalryHitCellProps = {
	/** 잡몹 등장 직후 필요 명중 */
	spawnRequiredHit: number
	/** 잡몹 감소 하한이자 보스 필요 명중 */
	requiredHit: number
	className?: string
}

/**
 * 잡몹은 등장 직후 → 하한, 보스는 고정값을 한 칸에 적습니다.
 * 예: 105 → 85 / 85
 */
function RivalryHitCell({ spawnRequiredHit, requiredHit, className }: RivalryHitCellProps) {
	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'px-1', className)}>
			<span className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
				<span>{formatLocaleNumber(spawnRequiredHit)}</span>
				<span className={SEPARATOR_CLASS_NAME}>→</span>
				<span>{formatLocaleNumber(requiredHit)}</span>
				<span className={SEPARATOR_CLASS_NAME}>/</span>
				<span>{formatLocaleNumber(requiredHit)}</span>
			</span>
		</TableCell>
	)
}

type RivalryDefenseCellProps = {
	className?: string
}

/**
 * 잡몹/보스 방어력.
 * 좁은 칸에서도 잘리지 않도록 글자 크기를 한 단계 낮추고, 넘치면 가로 스크롤합니다.
 */
function RivalryDefenseCell({ className }: RivalryDefenseCellProps) {
	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'overflow-x-auto px-1', className)}>
			<span className="xs:gap-1 xs:text-xs inline-flex items-center justify-center gap-0.5 text-[10px] whitespace-nowrap tabular-nums md:text-sm">
				<span>{formatLocaleNumber(GUILD_RIVALRY_MOB_DEFENSE)}</span>
				<span className={SEPARATOR_CLASS_NAME}>/</span>
				<span>{formatLocaleNumber(GUILD_RIVALRY_BOSS_DEFENSE)}</span>
			</span>
		</TableCell>
	)
}

type RivalryStageCellProps = {
	stage: number
}

/**
 * 단계 번호 + 해당 단계 보스 스프라이트.
 * 보스는 3종만 반복이라 네트워크는 캐시되고, 화면 밖 행은 lazy로 디코딩을 미룹니다.
 */
function RivalryStageCell({ stage }: RivalryStageCellProps) {
	const { label, imageSrc, imageWidth, imageHeight } = getGuildRivalryBossByStage(stage)

	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800 px-1')}>
			<span className="inline-flex items-center justify-center gap-1 md:gap-1.5">
				<span>{stage}</span>
				<Image
					src={imageSrc}
					alt={label}
					width={imageWidth}
					height={imageHeight}
					unoptimized
					loading="lazy"
					decoding="async"
					draggable={false}
					className="h-6 w-auto shrink-0 object-contain mix-blend-darken md:h-7"
				/>
			</span>
		</TableCell>
	)
}

/**
 * 길드 대항전 단계별 방어력·명중컷·보스 데미지 증가 스택 표.
 * 방어력은 전 단계 고정이라 같은 값을 반복하고, 필요 명중은 잡몹 감소 구간을 화살표로 보여 줍니다.
 */
function GuildRivalryTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600 w-[16%] md:w-[12%]')}>
						단계
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-orange-100 text-pastel-orange-900 w-[22%] md:w-[20%]')}>
						<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
							<span>방어력</span>
							<span className={HEAD_HINT_CLASS_NAME}>(잡몹 / 보스)</span>
						</span>
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-green-100 text-pastel-green-900 w-[22%] md:w-[24%]')}>
						보스 데미지 증가 스택
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-blue-100 text-pastel-blue-900 w-[40%] md:w-[44%]')}>
						<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
							<span>필요 명중</span>
							<span className={HEAD_HINT_CLASS_NAME}>(잡몹 / 보스)</span>
						</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{GUILD_RIVALRY_ENTRIES.map(({ stage, buffStack, requiredHit, spawnRequiredHit }) => (
					<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
						<RivalryStageCell stage={stage} />
						<RivalryDefenseCell className="bg-pastel-orange-50 text-grayscale-900" />
						<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-green-50 text-grayscale-900')}>
							{formatLocaleNumber(buffStack)}
						</TableCell>
						<RivalryHitCell
							spawnRequiredHit={spawnRequiredHit}
							requiredHit={requiredHit}
							className="bg-pastel-blue-50 text-grayscale-900"
						/>
					</TableRow>
				))}
			</TableBody>
		</HitCutTableShell>
	)
}

export default GuildRivalryTable
