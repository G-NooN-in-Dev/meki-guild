import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterNameLabel, { type MonsterNameLabelProps } from '@/features/tips/components/shared/monster-name-label'
import {
	EQUIPMENT_DUNGEON_MASK_FISH_SPEED_BUFF_SEC,
	EQUIPMENT_DUNGEON_POISON_PUFFER_EXPLOSION_DELAY_SEC,
	EQUIPMENT_DUNGEON_POISON_PUFFER_EXPLOSION_RANGE,
	EQUIPMENT_DUNGEON_POISON_PUFFER_HIT_CUT_BONUS
} from '@/features/tips/lib/growth-dungeon.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const MASK_FISH_LABEL = {
	src: '/monsters/mask-fish.gif',
	name: '마스크 피쉬',
	width: 76,
	height: 58,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const POISON_POOPA_LABEL = {
	src: '/monsters/poison-poopa.gif',
	name: '포이즌 푸퍼',
	width: 400,
	height: 307,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>제한시간 안에 정해진 수의 몬스터를 처치하세요.</li>
			<li>
				<MonsterNameLabel {...MASK_FISH_LABEL} />를 처치하면{' '}
				<EmphasizedText>{EQUIPMENT_DUNGEON_MASK_FISH_SPEED_BUFF_SEC}초</EmphasizedText> 동안 이동속도가 증가합니다.
			</li>
			<li>
				<MonsterNameLabel {...POISON_POOPA_LABEL} />를 처치하면{' '}
				<EmphasizedText>{EQUIPMENT_DUNGEON_POISON_PUFFER_EXPLOSION_DELAY_SEC}초</EmphasizedText> 후 주변{' '}
				<EmphasizedText>{formatLocaleNumber(EQUIPMENT_DUNGEON_POISON_PUFFER_EXPLOSION_RANGE)}</EmphasizedText> 만큼 광역
				폭발이 발생합니다.
			</li>
			<li>
				<MonsterNameLabel {...POISON_POOPA_LABEL} />의 필요 명중은 일반 몬스터보다{' '}
				<EmphasizedText>{EQUIPMENT_DUNGEON_POISON_PUFFER_HIT_CUT_BONUS}</EmphasizedText> 높습니다.
			</li>
		</ul>
	)
}

/** 장비 던전 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function EquipmentDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default EquipmentDungeonSummary
