import type { GuildMemberFilterState, NumberRange } from '@/features/guild/lib/filter-guild-members'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'
import { getGuildContentsOrder } from '@/libs/guild-contents-order.constants'
import { formatKoreanNumber, formatTrainingScore } from '@/utils/format-korean-number'

type SliderFieldKey = Exclude<keyof GuildMemberFilterState, 'classLines' | 'jobs' | 'expeditionGradeRank'>

type RangeBounds = {
	min: number
	max: number
}

/** 필터 슬라이더 필드. 표시 순서 컨텐츠는 상수 순서 */
const SLIDER_FIELDS: ReadonlyArray<{ key: SliderFieldKey; label: string }> = [
	{ key: 'level', label: '레벨' },
	{ key: 'combatPower', label: '전투력' },
	{ key: 'expeditionScore', label: '토벌전 (점수)' },
	{ key: 'rivalry', label: '대항전' },
	...getGuildContentsOrder().map(({ key, label }) => ({ key, label }))
]

/** 토벌 등급 슬라이더 전체 구간 (1=챌린저1 … 15=마스터5) */
const EXPEDITION_GRADE_BOUNDS = {
	min: 1,
	max: EXPEDITION_GUILD_TIERS.length
} as const satisfies RangeBounds

function getSliderFieldValue(member: GuildMemberComparison, key: SliderFieldKey): number | null {
	switch (key) {
		case 'level':
			return member.level.hasValue ? member.level.current : null
		case 'combatPower':
			return member.combatPower.hasValue ? Number(member.combatPower.current) : null
		case 'expeditionScore':
			return member.expeditionScore.hasValue ? Number(member.expeditionScore.current) : null
		case 'rivalry':
			return member.rivalry.hasValue ? Number(member.rivalry.current) : null
		case 'training':
			return member.training.hasValue ? Number(member.training.current) : null
		case 'guildBoss':
			return member.guildBoss.hasValue ? Number(member.guildBoss.current) : null
	}
}

/** 현재 멤버 데이터에서 슬라이더 min/max 경계를 계산합니다. */
function getSliderBounds(comparisons: GuildMemberComparison[], key: SliderFieldKey): RangeBounds | null {
	let min = Number.POSITIVE_INFINITY
	let max = Number.NEGATIVE_INFINITY

	for (const member of comparisons) {
		const value = getSliderFieldValue(member, key)

		if (value === null) {
			continue
		}

		min = Math.min(min, value)
		max = Math.max(max, value)
	}

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		return null
	}

	// Slider는 min !== max 가 필요해, 값이 하나뿐일 때 1칸 여유를 둡니다
	if (min === max) {
		return { min, max: min + 1 }
	}

	return { min, max }
}

function getSliderStep({ min, max }: RangeBounds): number {
	const span = max - min

	if (span <= 100) {
		return 1
	}

	if (span <= 10_000) {
		return 10
	}

	if (span <= 1_000_000) {
		return 1_000
	}

	return Math.max(1, Math.round(span / 200))
}

/** 슬라이더 표시값 — 테이블과 같은 한국어 단위(만/억/조)로 맞춰 가독성을 높입니다. */
function formatSliderBound(key: SliderFieldKey, value: number): string {
	const rounded = Math.round(value)

	switch (key) {
		case 'level':
			return `Lv.${rounded}`
		case 'training':
			return formatTrainingScore(BigInt(rounded))
		case 'combatPower':
		case 'expeditionScore':
		case 'rivalry':
		case 'guildBoss':
			return formatKoreanNumber(BigInt(rounded))
	}
}

/** 양쪽 끝이 데이터 경계면 null(필터 없음)로 되돌립니다. */
function sliderValuesToRange(values: readonly number[], bounds: RangeBounds): NumberRange {
	const low = values[0] ?? bounds.min
	const high = values[1] ?? bounds.max

	return {
		min: low <= bounds.min ? null : low,
		max: high >= bounds.max ? null : high
	}
}

function rangeToSliderValues(range: NumberRange, bounds: RangeBounds): [number, number] {
	return [range.min ?? bounds.min, range.max ?? bounds.max]
}

/** 등급 순위(1~15) → 챌린저1 등 표시명 */
function formatGradeRank(rank: number): string {
	return EXPEDITION_GUILD_TIERS[Math.round(rank) - 1]?.rank ?? String(Math.round(rank))
}

/** 직업군을 n개씩 묶어 그리드 행으로 씁니다. (예: 3 → 전사·마법사·궁수 / 도적·해적) */
function chunkClassLines<T>(items: readonly T[], size: number): T[][] {
	const chunks: T[][] = []

	for (let index = 0; index < items.length; index += size) {
		chunks.push([...items.slice(index, index + size)])
	}

	return chunks
}

export {
	chunkClassLines,
	EXPEDITION_GRADE_BOUNDS,
	formatGradeRank,
	formatSliderBound,
	getSliderBounds,
	getSliderStep,
	rangeToSliderValues,
	SLIDER_FIELDS,
	sliderValuesToRange
}
export type { RangeBounds, SliderFieldKey }
