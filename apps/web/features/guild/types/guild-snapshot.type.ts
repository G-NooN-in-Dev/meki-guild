export type GuildMemberInput = {
	name: string
	level: number
	job: string
	combatPower: string | number
	expedition: {
		grade: string
		score: string | number
		/** 개인 토벌전 등수(1이 최상위). 미입력이면 null */
		placement: number | null
	}
	rivalry: string | number
	training: string | number
	/** 대항전과 동일한 한국어 숫자 형식. 아직 수집 전이면 생략 가능 */
	guildBoss?: string | number
}

/** 한 시점의 길드원 스냅샷. 수집일은 guild-content-dates.json 에서 분야별로 관리합니다. */
export type GuildWeekSnapshot = {
	members: GuildMemberInput[]
}

/** 표시할 값이 없을 때(미입력·비교 불가·집계 없음 등)의 화면 표기 */
export const GUILD_EMPTY_VALUE_LABEL = '-'

/** 증감이 0일 때의 화면 표기 (+0 대신) */
export const GUILD_ZERO_DELTA_LABEL = '-'

export type ParsedGuildMember = {
	name: string
	level: number
	job: string
	combatPower: bigint
	combatPowerLabel: string
	hasCombatPower: boolean
	hasLevel: boolean
	expedition: {
		grade: string
		score: bigint
		scoreLabel: string
		hasGrade: boolean
		hasScore: boolean
		/** 개인 토벌전 등수. 미입력이면 0 + hasPlacement=false */
		placement: number
		placementLabel: string
		hasPlacement: boolean
	}
	rivalry: bigint
	rivalryLabel: string
	hasRivalry: boolean
	training: bigint
	trainingLabel: string
	hasTraining: boolean
	guildBoss: bigint
	guildBossLabel: string
	hasGuildBoss: boolean
}

export type NumericDelta = {
	current: bigint
	previous: bigint | null
	diff: bigint | null
	currentLabel: string
	previousLabel: string | null
	diffLabel: string | null
	/** 이전 값 대비 증감 비율. 비교 불가(신규·이전값 0)면 null */
	diffPercentLabel: string | null
	/** false면 아직 입력 전(미입력) */
	hasValue: boolean
}

export type LevelDelta = {
	current: number
	previous: number | null
	diff: number | null
	/** 레벨 증감 표시. 상승=▲, 하락=▼, 변동 없으면 null */
	diffLabel: string | null
	currentLabel: string
	/** false면 아직 입력 전(미입력) */
	hasValue: boolean
}

export type MemberComparisonStatus = 'active' | 'new' | 'left'

export type GuildMemberComparison = {
	name: string
	job: string
	/** 직전 주 직업. 신규·탈퇴·직전 데이터 없으면 null */
	previousJob: string | null
	/** 직전 주 대비 직업이 바뀌었는지 */
	jobChanged: boolean
	status: MemberComparisonStatus
	level: LevelDelta
	combatPower: NumericDelta
	expeditionScore: NumericDelta
	expeditionGrade: {
		current: string
		previous: string | null
		currentLabel: string
		/** 양수=등급 상승, 음수=등급 하락. 이전 주 데이터가 없으면 null */
		diff: number | null
		diffLabel: string | null
		changed: boolean
		/** false면 아직 입력 전(미입력) */
		hasValue: boolean
	}
	/**
	 * 토벌전 개인 등수. 숫자가 작을수록 상위.
	 * 최신이 미입력이어도 previous는 직전 값을 유지해 Dialog에서 볼 수 있게 합니다.
	 */
	expeditionPlacement: LevelDelta
	rivalry: NumericDelta
	training: NumericDelta
	guildBoss: NumericDelta
}

export type GuildDashboardData = {
	currentWeek: GuildWeekSnapshot
	previousWeek: GuildWeekSnapshot
	comparisons: GuildMemberComparison[]
	rankings: import('@/utils/compute-member-rankings').MemberRankings
	/** 직전 주 기준 순위. 순위 변동 표시에 사용 */
	previousRankings: import('@/utils/compute-member-rankings').MemberRankings
}

/** 1 vs 1 비교에서 우세한 쪽 */
export type MemberVsWinner = 'left' | 'right' | 'tie'

export type MemberVsNumericField = {
	left: bigint
	right: bigint
	leftLabel: string
	rightLabel: string
	diff: bigint
	diffLabel: string | null
	winner: MemberVsWinner
	diffPercentLabel: string | null
}

export type MemberVsLevelField = {
	left: number
	right: number
	diff: number
	diffLabel: string | null
	winner: MemberVsWinner
}

export type MemberVsExpeditionGradeField = {
	left: string
	right: string
	diff: number | null
	diffLabel: string | null
	winner: MemberVsWinner
}

/** 토벌전 등수 1vs1. 낮은 등수가 우세. 미입력 시 leftHasValue/rightHasValue로 구분 */
export type MemberVsPlacementField = {
	left: number
	right: number
	leftLabel: string
	rightLabel: string
	diff: number
	diffLabel: string | null
	winner: MemberVsWinner
	leftHasValue: boolean
	rightHasValue: boolean
}

/** 두 길드원 간 스펙 비교 결과 */
export type MemberVsMemberComparison = {
	left: Pick<ParsedGuildMember, 'name' | 'job'>
	right: Pick<ParsedGuildMember, 'name' | 'job'>
	level: MemberVsLevelField
	combatPower: MemberVsNumericField
	expeditionGrade: MemberVsExpeditionGradeField
	expeditionPlacement: MemberVsPlacementField
	expeditionScore: MemberVsNumericField
	rivalry: MemberVsNumericField
	training: MemberVsNumericField
	guildBoss: MemberVsNumericField & { leftHasValue: boolean; rightHasValue: boolean }
}

export type GuildComparePageData = {
	members: GuildMemberInput[]
	rankings: import('@/utils/compute-member-rankings').MemberRankings
}
