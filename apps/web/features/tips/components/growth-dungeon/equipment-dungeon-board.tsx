import EquipmentDungeonHitCutTable from '@/features/tips/components/growth-dungeon/equipment-dungeon-hit-cut-table'
import EquipmentDungeonSummary from '@/features/tips/components/growth-dungeon/equipment-dungeon-summary'

/** 장비 던전 규칙 요약 + 명중컷 표 */
function EquipmentDungeonBoard() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<EquipmentDungeonSummary />
			<EquipmentDungeonHitCutTable />
		</div>
	)
}

export default EquipmentDungeonBoard
