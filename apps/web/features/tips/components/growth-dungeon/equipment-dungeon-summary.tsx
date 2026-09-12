import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import { EQUIPMENT_DUNGEON_POISON_PUFFER_HIT_CUT_BONUS } from '@/features/tips/lib/growth-dungeon.constants'

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm md:text-base">
			<li>제한시간 안에 정해진 수의 몬스터를 처치하세요.</li>
			<li>
				<EmphasizedText>마스크 피쉬</EmphasizedText>를 처치하면 잠시 동안 속도가 증가합니다.
			</li>
			<li>
				<EmphasizedText>포이즌 푸퍼</EmphasizedText>를 처치하면 광역기가 발동합니다.
			</li>
			<li>
				포이즌 푸퍼의 명중컷은 일반 몬스터보다{' '}
				<EmphasizedText>{EQUIPMENT_DUNGEON_POISON_PUFFER_HIT_CUT_BONUS}</EmphasizedText> 높습니다.
			</li>
		</ul>
	)
}

/** 장비 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. 모바일은 접고, md 이상은 펼칩니다. */
function EquipmentDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default EquipmentDungeonSummary
