import WeaponDungeonHitCutTable from '@/features/tips/components/growth-dungeon/weapon-dungeon-hit-cut-table'
import WeaponDungeonSummary from '@/features/tips/components/growth-dungeon/weapon-dungeon-summary'

/** 무기 던전 규칙 요약 + 명중컷 표 */
function WeaponDungeonBoard() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<WeaponDungeonSummary />
			<WeaponDungeonHitCutTable />
		</div>
	)
}

export default WeaponDungeonBoard
