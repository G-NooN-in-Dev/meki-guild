import EnhanceDungeonHitCutTable from '@/features/tips/components/growth-dungeon/enhance-dungeon-hit-cut-table'
import EnhanceDungeonMysteriousScrollTable from '@/features/tips/components/growth-dungeon/enhance-dungeon-mysterious-scroll-table'
import EnhanceDungeonSummary from '@/features/tips/components/growth-dungeon/enhance-dungeon-summary'

/** 강화 던전 규칙 요약 + 주문서 확률 + 명중컷 표 */
function EnhanceDungeonBoard() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<EnhanceDungeonSummary />
			<EnhanceDungeonMysteriousScrollTable />
			<EnhanceDungeonHitCutTable />
		</div>
	)
}

export default EnhanceDungeonBoard
