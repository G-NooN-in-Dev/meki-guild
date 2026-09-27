'use client'

import { cn } from '@shared/ui/utils'

import GrowthDelta from '@/features/guild/components/growth-delta'
import type { CharacterCompareSide, CharacterCompareWinner } from '@/features/tips/types/character-compare.type'
import { getContentGradeTextClass } from '@/libs/content-tier-band.constants'
import { getWeaponGradeTextClass } from '@/libs/weapon-grade.constants'

type CompareRowCell = {
	label: string
	/** 승패 하이라이트용. 텍스트-only 행은 tie */
	winner: CharacterCompareWinner
	/** 해당 쪽이 값이 없어 흐리게 표시할지 */
	muted?: boolean
}

type CompareRowValueKind = 'text' | 'contentGrade' | 'weaponGrade'

type CompareRow = {
	label: string
	left: CompareRowCell
	right: CompareRowCell
	/**
	 * left − right 기준 차이 라벨.
	 * 렌더 시 우세한 쪽에만 양수 표기로 붙입니다.
	 */
	diffLabel: string | null
	/** contentGrade: 토벌전·월드보스 / weaponGrade: 무기 */
	valueKind?: CompareRowValueKind
	/** 전투력·점수처럼 diff가 길어질 수 있으면 GrowthDelta에 truncate */
	truncateDiff?: boolean
}

type CharacterCompareRowItemProps = {
	row: CompareRow
}

function getWinnerClassName(side: CharacterCompareSide, winner: CharacterCompareWinner): string {
	if (winner === 'tie') {
		return 'text-grayscale-900'
	}

	return winner === side ? 'text-pastel-green-800 font-semibold' : 'text-grayscale-500'
}

/** 우세한 쪽 기준 양수 표기로 뒤집습니다. */
function getWinnerDiffLabel(
	winner: CharacterCompareWinner,
	side: CharacterCompareSide,
	diffLabel: string | null
): string | null {
	if (!diffLabel || winner === 'tie' || winner !== side) {
		return null
	}

	if (winner === 'left') {
		return diffLabel
	}

	if (diffLabel.startsWith('+')) {
		return `-${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('-')) {
		return `+${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('▲')) {
		return `▼${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('▼')) {
		return `▲${diffLabel.slice(1)}`
	}

	return diffLabel
}

function getGradeTextClass(valueKind: CompareRowValueKind, label: string): string {
	if (valueKind === 'weaponGrade') {
		return getWeaponGradeTextClass(label)
	}

	if (valueKind === 'contentGrade') {
		return getContentGradeTextClass(label)
	}

	return ''
}

type CompareValueProps = {
	side: CharacterCompareSide
	cell: CompareRowCell
	diffLabel: string | null
	valueKind: CompareRowValueKind
	truncateDiff?: boolean
}

function CompareValue({ side, cell, diffLabel, valueKind, truncateDiff = false }: CompareValueProps) {
	const winnerDiffLabel = getWinnerDiffLabel(cell.winner, side, diffLabel)
	const useGradeColor = valueKind !== 'text' && !cell.muted

	return (
		<div
			className={cn(
				'flex w-full min-w-0 flex-col items-center gap-0.5 text-center',
				cell.muted && 'text-grayscale-400',
				!cell.muted && !useGradeColor && getWinnerClassName(side, cell.winner)
			)}
		>
			<p
				className={cn(
					'w-full min-w-0 truncate text-center text-sm md:text-base',
					useGradeColor && getGradeTextClass(valueKind, cell.label)
				)}
			>
				{cell.label}
			</p>
			{winnerDiffLabel ? (
				<GrowthDelta
					value={winnerDiffLabel}
					className={cn('w-full text-center text-[11px] md:text-xs', truncateDiff && 'block max-w-full truncate')}
				/>
			) : null}
		</div>
	)
}

function CharacterCompareRowItem({ row }: CharacterCompareRowItemProps) {
	const { diffLabel, label, left, right, truncateDiff, valueKind } = row

	const rowValueKind = valueKind ?? 'text'

	return (
		<div className="border-grayscale-100 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b px-3 py-2.5 last:border-b-0 md:gap-3 md:px-4 md:py-3">
			<CompareValue
				side="left"
				cell={left}
				diffLabel={diffLabel}
				valueKind={rowValueKind}
				truncateDiff={truncateDiff}
			/>

			<p className="text-grayscale-500 min-w-18 text-center text-[11px] font-medium md:min-w-24 md:text-xs">{label}</p>

			<CompareValue
				side="right"
				cell={right}
				diffLabel={diffLabel}
				valueKind={rowValueKind}
				truncateDiff={truncateDiff}
			/>
		</div>
	)
}

export { CharacterCompareRowItem }
export type { CompareRow }
