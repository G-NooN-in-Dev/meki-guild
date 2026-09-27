'use client'

import {
	CharacterCompareRowItem,
	type CompareRow
} from '@/features/tips/components/character-compare/character-compare-rows'
import type {
	CharacterCompareGradeField,
	CharacterCompareNullableNumberField,
	CharacterCompareNumericField,
	CharacterCompareRankField,
	CharacterCompareResult,
	CharacterCompareTextField
} from '@/features/tips/types/character-compare.type'

import CharacterSummaryCard from './character-summary-card'

type CharacterCompareResultBoardProps = {
	comparison: CharacterCompareResult
}

function toNumericRow(label: string, field: CharacterCompareNumericField): CompareRow {
	return {
		label,
		left: { label: field.leftLabel, winner: field.winner, muted: !field.leftHasValue },
		right: { label: field.rightLabel, winner: field.winner, muted: !field.rightHasValue },
		diffLabel: field.diffLabel,
		// 전투력·점수 격차는 한국어 단위로 길어질 수 있음
		truncateDiff: true
	}
}

function toRankRow(label: string, field: CharacterCompareRankField): CompareRow {
	return {
		label,
		left: { label: field.leftLabel, winner: field.winner, muted: !field.leftHasValue },
		right: { label: field.rightLabel, winner: field.winner, muted: !field.rightHasValue },
		diffLabel: field.diffLabel
	}
}

function toTextRow(label: string, field: CharacterCompareTextField): CompareRow {
	return {
		label,
		left: { label: field.leftLabel, winner: 'tie' },
		right: { label: field.rightLabel, winner: 'tie' },
		diffLabel: null
	}
}

function toNullableNumberRow(label: string, field: CharacterCompareNullableNumberField): CompareRow {
	return {
		label,
		left: { label: field.leftLabel, winner: field.winner, muted: !field.leftHasValue },
		right: { label: field.rightLabel, winner: field.winner, muted: !field.rightHasValue },
		diffLabel: field.diffLabel
	}
}

function toGradeRow(
	label: string,
	field: CharacterCompareGradeField,
	valueKind: 'contentGrade' | 'weaponGrade' = 'contentGrade'
): CompareRow {
	return {
		label,
		left: { label: field.leftLabel, winner: field.winner, muted: !field.leftHasValue },
		right: { label: field.rightLabel, winner: field.winner, muted: !field.rightHasValue },
		diffLabel: field.diffLabel,
		valueKind
	}
}

function buildCompareRows(comparison: CharacterCompareResult): CompareRow[] {
	return [
		toRankRow('전체 랭킹', comparison.globalRank),
		toTextRow('서버', comparison.serverLabel),
		toRankRow('서버 랭킹', comparison.serverRank),
		toNullableNumberRow('인기도', comparison.popularity),
		{
			label: '레벨',
			left: { label: comparison.level.leftLabel, winner: comparison.level.winner },
			right: { label: comparison.level.rightLabel, winner: comparison.level.winner },
			diffLabel: comparison.level.diffLabel
		},
		toNumericRow('전투력', comparison.combatPower),
		toGradeRow('장착 무기', comparison.weapon, 'weaponGrade'),
		toGradeRow('토벌전 등급', comparison.expeditionGrade),
		toRankRow('토벌전 등수', comparison.expeditionRank),
		toNumericRow('토벌전 점수', comparison.expeditionScore),
		toGradeRow('월드보스 등급', comparison.worldBossGrade),
		toRankRow('월드보스 등수', comparison.worldBossRank),
		toNumericRow('월드보스 점수', comparison.worldBossScore)
	]
}

function CharacterCompareResultBoard({ comparison }: CharacterCompareResultBoardProps) {
	const rows = buildCompareRows(comparison)

	return (
		<div className="flex flex-col gap-3 md:gap-4">
			<div className="flex items-center justify-center gap-3">
				<CharacterSummaryCard role="나" character={comparison.left} />
				<div className="text-grayscale-400 items-center justify-center text-sm font-semibold md:px-2">VS</div>
				<CharacterSummaryCard role="상대방" character={comparison.right} />
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft overflow-hidden rounded-xl border">
				<div className="bg-card min-w-0">
					{rows.map((row) => (
						<CharacterCompareRowItem key={row.label} row={row} />
					))}
				</div>
			</div>
		</div>
	)
}

export default CharacterCompareResultBoard
