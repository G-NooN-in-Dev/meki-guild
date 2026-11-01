import EmphasizedText from '@/features/tips/components/shared/emphasized-text'
import HitCutSummaryCard from '@/features/tips/components/shared/hit-cut-summary-card'
import MonsterNameLabel, { type MonsterNameLabelProps } from '@/features/tips/components/shared/monster-name-label'
import {
	ABILITY_DUNGEON_BOSS_TIME_LIMIT_SEC,
	ABILITY_DUNGEON_BUFF_DURATION_SEC,
	ABILITY_DUNGEON_BUFF_MAX_ATTACK_PERCENT,
	ABILITY_DUNGEON_BUFF_MAX_MOVE_SPEED_PERCENT,
	ABILITY_DUNGEON_BUFF_MAX_STACKS,
	ABILITY_DUNGEON_CELLION_ATTACK_BUFF_PERCENT,
	ABILITY_DUNGEON_CELLION_MOVE_SPEED_BUFF_PERCENT,
	ABILITY_DUNGEON_LIONER_ATTACK_BUFF_PERCENT,
	ABILITY_DUNGEON_LIONER_ATTACK_SPEED_BUFF_PERCENT,
	ABILITY_DUNGEON_NORMAL_ATTACK_BUFF_PERCENT,
	ABILITY_DUNGEON_NORMAL_HIT_CUT_BONUS,
	ABILITY_DUNGEON_NORMAL_MOVE_SPEED_BUFF_PERCENT,
	ABILITY_DUNGEON_NORMAL_TIME_LIMIT_SEC
} from '@/features/tips/lib/growth-dungeon.constants'

/** 애니메이션 GIF라 이미지 최적화를 끄고 원본 비율 그대로 붙입니다. */
const JUNIOR_GRUPIN_LABEL = {
	src: '/monsters/junior-grupin.gif',
	name: '주니어 그류핀',
	width: 34,
	height: 42,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const JUNIOR_LUCIDA_LABEL = {
	src: '/monsters/junior-lucida.gif',
	name: '주니어 루이넬',
	width: 38,
	height: 54,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const STAR_PIXIE_LABEL = {
	src: '/monsters/star-pixie.gif',
	name: '스타픽시',
	width: 56,
	height: 58,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const ELIZA_LABEL = {
	src: '/monsters/eliza.gif',
	name: '엘리쟈',
	width: 400,
	height: 295,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const LIONER_LABEL = {
	src: '/monsters/lioner.gif',
	name: '라이오너',
	width: 54,
	height: 56,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const CELLION_LABEL = {
	src: '/monsters/cellion.gif',
	name: '샐리온',
	width: 54,
	height: 56,
	unoptimized: true
} as const satisfies MonsterNameLabelProps

const NORMAL_MONSTER_LABELS = [JUNIOR_GRUPIN_LABEL, JUNIOR_LUCIDA_LABEL, STAR_PIXIE_LABEL] as const

type MonsterNameListProps = {
	labels: readonly MonsterNameLabelProps[]
}

/** 같은 역할의 몬스터를 이름·스프라이트와 함께 한 줄로 잇습니다. */
function MonsterNameList({ labels }: MonsterNameListProps) {
	return labels.map((label, index) => (
		<span key={label.src}>
			{index > 0 ? <span className="text-grayscale-400"> · </span> : null}
			<MonsterNameLabel {...label} />
		</span>
	))
}

function SummaryRulesList() {
	return (
		<ul className="text-grayscale-600 list-disc space-y-1.5 pl-5 text-sm break-keep md:text-base">
			<li>
				제한시간 <EmphasizedText>{ABILITY_DUNGEON_NORMAL_TIME_LIMIT_SEC}초</EmphasizedText> 동안 몬스터를 사냥하세요.
			</li>
			<li>
				이후 제한시간 <EmphasizedText>{ABILITY_DUNGEON_BOSS_TIME_LIMIT_SEC}초</EmphasizedText> 안에{' '}
				<MonsterNameLabel {...ELIZA_LABEL} />를 처치하세요.
			</li>
			<li>
				<MonsterNameList labels={NORMAL_MONSTER_LABELS} /> 처치 시,{' '}
				<EmphasizedText>{ABILITY_DUNGEON_BUFF_DURATION_SEC}초</EmphasizedText>간 공격력이{' '}
				<EmphasizedText>{ABILITY_DUNGEON_NORMAL_ATTACK_BUFF_PERCENT}%</EmphasizedText>, 이동속도가{' '}
				<EmphasizedText>{ABILITY_DUNGEON_NORMAL_MOVE_SPEED_BUFF_PERCENT}%</EmphasizedText> 증가합니다.
			</li>
			<li>
				<MonsterNameLabel {...LIONER_LABEL} /> 처치 시,{' '}
				<EmphasizedText>{ABILITY_DUNGEON_BUFF_DURATION_SEC}초</EmphasizedText>간 공격력이{' '}
				<EmphasizedText>{ABILITY_DUNGEON_LIONER_ATTACK_BUFF_PERCENT}%</EmphasizedText>, 공격속도가{' '}
				<EmphasizedText>{ABILITY_DUNGEON_LIONER_ATTACK_SPEED_BUFF_PERCENT}%</EmphasizedText> 증가합니다.
			</li>
			<li>
				<MonsterNameLabel {...CELLION_LABEL} /> 처치 시,{' '}
				<EmphasizedText>{ABILITY_DUNGEON_BUFF_DURATION_SEC}초</EmphasizedText>간 공격력이{' '}
				<EmphasizedText>{ABILITY_DUNGEON_CELLION_ATTACK_BUFF_PERCENT}%</EmphasizedText>, 이동속도가{' '}
				<EmphasizedText>{ABILITY_DUNGEON_CELLION_MOVE_SPEED_BUFF_PERCENT}%</EmphasizedText> 증가합니다.
			</li>
			<li>
				버프 스택은 최대 <EmphasizedText>{ABILITY_DUNGEON_BUFF_MAX_STACKS}</EmphasizedText> 스택 (공격력{' '}
				<EmphasizedText>{ABILITY_DUNGEON_BUFF_MAX_ATTACK_PERCENT}%</EmphasizedText>, 이동속도{' '}
				<EmphasizedText>{ABILITY_DUNGEON_BUFF_MAX_MOVE_SPEED_PERCENT}%</EmphasizedText>)까지 적용됩니다.
			</li>
			<li>
				일반 몬스터의 필요 명중은 라이오너·샐리온·엘리쟈보다{' '}
				<EmphasizedText>{ABILITY_DUNGEON_NORMAL_HIT_CUT_BONUS}</EmphasizedText> 높습니다.
			</li>
		</ul>
	)
}

/** 용사의 수련장 규칙 요약 카드. 표에 안 나오는 배경 규칙만 모읍니다. */
function AbilityDungeonSummary() {
	return (
		<HitCutSummaryCard>
			<SummaryRulesList />
		</HitCutSummaryCard>
	)
}

export default AbilityDungeonSummary
