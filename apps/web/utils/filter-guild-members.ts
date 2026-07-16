import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getExpeditionGradeRank } from '@/libs/expedition-guild-tier.constants'
import { getJobClassLine, type JobClassLine } from '@/libs/job-class.constants'

/** 숫자 range. null이면 해당 쪽 제한 없음 */
export type NumberRange = {
	min: number | null
	max: number | null
}

/**
 * 길드원 테이블 필터 상태.
 * 직업군(전사·마법사 등)/직업은 배열(다중 선택). 숫자·등급은 min~max range.
 */
export type GuildMemberFilterState = {
	/** 빈 배열 = 직업군 필터 없음(전체) */
	classLines: JobClassLine[]
	/** 빈 배열 = 직업 필터 없음(전체) */
	jobs: string[]
	level: NumberRange
	combatPower: NumberRange
	/** 토벌 등급: getExpeditionGradeRank 기준 (1=챌린저1 … 15=마스터5) */
	expeditionGradeRank: NumberRange
	expeditionScore: NumberRange
	rivalry: NumberRange
	training: NumberRange
	guildBoss: NumberRange
}

/** 필터 초기값(매 호출마다 새 객체 — 상태 공유 방지) */
export function createEmptyGuildMemberFilter(): GuildMemberFilterState {
	return {
		classLines: [],
		jobs: [],
		level: { min: null, max: null },
		combatPower: { min: null, max: null },
		expeditionGradeRank: { min: null, max: null },
		expeditionScore: { min: null, max: null },
		rivalry: { min: null, max: null },
		training: { min: null, max: null },
		guildBoss: { min: null, max: null }
	}
}

/** range에 min 또는 max가 하나라도 걸려 있는지 */
export function isNumberRangeActive({ min, max }: NumberRange): boolean {
	return min !== null || max !== null
}

/** 직업군·직업 중 하나라도 선택됐는지 */
export function isJobTaxonomyFilterActive(filter: GuildMemberFilterState): boolean {
	return filter.classLines.length > 0 || filter.jobs.length > 0
}

/** 필터가 하나라도 적용 중인지 */
export function isGuildMemberFilterActive(filter: GuildMemberFilterState): boolean {
	if (isJobTaxonomyFilterActive(filter)) {
		return true
	}

	return (
		isNumberRangeActive(filter.level) ||
		isNumberRangeActive(filter.combatPower) ||
		isNumberRangeActive(filter.expeditionGradeRank) ||
		isNumberRangeActive(filter.expeditionScore) ||
		isNumberRangeActive(filter.rivalry) ||
		isNumberRangeActive(filter.training) ||
		isNumberRangeActive(filter.guildBoss)
	)
}

/**
 * 활성 필터 조건 개수.
 * 직업군·직업은 1조건으로 세고, range 필드는 값이 있는 항목마다 1개로 셉니다.
 */
export function countActiveGuildMemberFilters(filter: GuildMemberFilterState): number {
	let count = 0

	if (isJobTaxonomyFilterActive(filter)) {
		count += 1
	}

	const ranges = [
		filter.level,
		filter.combatPower,
		filter.expeditionGradeRank,
		filter.expeditionScore,
		filter.rivalry,
		filter.training,
		filter.guildBoss
	] as const

	for (const range of ranges) {
		if (isNumberRangeActive(range)) {
			count += 1
		}
	}

	return count
}

/** min > max로 입력돼도 구간이 비지 않도록 정렬합니다. */
function normalizeNumberRange({ min, max }: NumberRange): NumberRange {
	if (min !== null && max !== null && min > max) {
		return { min: max, max: min }
	}

	return { min, max }
}

/**
 * 값이 range에 들어가는지 확인합니다.
 * range가 걸려 있는데 미입력이면 제외합니다(제한 없을 때만 미입력 통과).
 */
function matchesNumberRange(hasValue: boolean, value: number | bigint, range: NumberRange): boolean {
	const { min, max } = normalizeNumberRange(range)

	if (min === null && max === null) {
		return true
	}

	if (!hasValue) {
		return false
	}

	const numericValue = typeof value === 'bigint' ? Number(value) : value

	if (min !== null && numericValue < min) {
		return false
	}

	if (max !== null && numericValue > max) {
		return false
	}

	return true
}

/**
 * 직업군·직업 필터 매칭.
 * 직업군이 선택된 상태에서 같은 직업군의 직업이 일부만 고르면 그 직업만 통과합니다.
 */
function matchesJobTaxonomyFilter(job: string, filter: GuildMemberFilterState): boolean {
	const { classLines, jobs } = filter

	if (classLines.length === 0 && jobs.length === 0) {
		return true
	}

	const currentClassLine = getJobClassLine(job)

	// 같은 직업군에 선택 직업이 있으면, 해당 직업군은 선택 직업만 통과 (예: 마법사 + 썬콜/비숍 → 불독 제외)
	if (currentClassLine !== null && classLines.includes(currentClassLine)) {
		const hasPickedJobsInClassLine = jobs.some((pickedJob) => getJobClassLine(pickedJob) === currentClassLine)

		if (hasPickedJobsInClassLine) {
			return jobs.includes(job)
		}
	}

	if (jobs.includes(job)) {
		return true
	}

	if (currentClassLine !== null && classLines.includes(currentClassLine)) {
		return true
	}

	return false
}

/** 필터 상태를 적용해 길드원 목록을 좁힙니다. */
export function filterGuildMembers(
	comparisons: GuildMemberComparison[],
	filter: GuildMemberFilterState
): GuildMemberComparison[] {
	return comparisons.filter((member) => {
		const { job, level, combatPower, expeditionGrade, expeditionScore, rivalry, training, guildBoss } = member

		if (!matchesJobTaxonomyFilter(job, filter)) {
			return false
		}

		if (!matchesNumberRange(level.hasValue, level.current, filter.level)) {
			return false
		}

		if (!matchesNumberRange(combatPower.hasValue, combatPower.current, filter.combatPower)) {
			return false
		}

		// 등급은 문자열 비교 대신 순위(1~15)로 range 매칭
		const gradeRank = expeditionGrade.hasValue ? getExpeditionGradeRank(expeditionGrade.current) : null

		if (!matchesNumberRange(gradeRank !== null, gradeRank ?? 0, filter.expeditionGradeRank)) {
			return false
		}

		if (!matchesNumberRange(expeditionScore.hasValue, expeditionScore.current, filter.expeditionScore)) {
			return false
		}

		if (!matchesNumberRange(rivalry.hasValue, rivalry.current, filter.rivalry)) {
			return false
		}

		if (!matchesNumberRange(training.hasValue, training.current, filter.training)) {
			return false
		}

		if (!matchesNumberRange(guildBoss.hasValue, guildBoss.current, filter.guildBoss)) {
			return false
		}

		return true
	})
}
