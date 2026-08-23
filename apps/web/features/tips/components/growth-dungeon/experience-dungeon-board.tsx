import ExperienceDungeonHitCutTable from '@/features/tips/components/growth-dungeon/experience-dungeon-hit-cut-table'
import ExperienceDungeonSummary from '@/features/tips/components/growth-dungeon/experience-dungeon-summary'

/** 경험치 던전 규칙 요약 + 명중컷 표 */
function ExperienceDungeonBoard() {
	return (
		<div className="flex flex-col gap-4 md:gap-6">
			<ExperienceDungeonSummary />
			<ExperienceDungeonHitCutTable />
		</div>
	)
}

export default ExperienceDungeonBoard
