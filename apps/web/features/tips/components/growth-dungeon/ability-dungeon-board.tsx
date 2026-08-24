import AbilityDungeonHitCutTable from '@/features/tips/components/growth-dungeon/ability-dungeon-hit-cut-table'
import AbilityDungeonSummary from '@/features/tips/components/growth-dungeon/ability-dungeon-summary'

/** 용사의 수련장 규칙 요약 + 명중컷 표 */
function AbilityDungeonBoard() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<AbilityDungeonSummary />
			<AbilityDungeonHitCutTable />
		</div>
	)
}

export default AbilityDungeonBoard
