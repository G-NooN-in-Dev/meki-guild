export type GuildMemberInput = {
	name: string
	level: number
	job: string
	combatPower: string | number
	expedition: {
		grade: string
		score: string | number
	}
	rivalry: string | number
	training: string | number
	/** 대항전과 동일한 한국어 숫자 형식. 아직 수집 전이면 생략 가능 */
	guildBoss?: string | number
}

export type GuildWeekSnapshot = {
	updatedAt: string
	members: GuildMemberInput[]
}

/** 아직 입력되지 않은 항목의 화면 표기 */
export const GUILD_UNENTERED_LABEL = '미입력'

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
	rivalry: NumericDelta
	training: NumericDelta
	guildBoss: NumericDelta
}

export type GuildDashboardData = {
	currentWeek: GuildWeekSnapshot
	previousWeek: GuildWeekSnapshot
	comparisons: GuildMemberComparison[]
}
