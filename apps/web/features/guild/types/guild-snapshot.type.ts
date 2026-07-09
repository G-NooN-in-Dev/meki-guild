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
	weekLabel: string
	updatedAt: string
	members: GuildMemberInput[]
}

export type ParsedGuildMember = {
	name: string
	level: number
	job: string
	combatPower: bigint
	combatPowerLabel: string
	expedition: {
		grade: string
		score: bigint
		scoreLabel: string
	}
	rivalry: bigint
	rivalryLabel: string
	training: bigint
	trainingLabel: string
	guildBoss: bigint
	guildBossLabel: string
	/** JSON에 guildBoss 필드가 있는지 여부 */
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
}

export type LevelDelta = {
	current: number
	previous: number | null
	diff: number | null
	/** 레벨 증감 표시. 상승=▲, 하락=▼, 변동 없으면 null */
	diffLabel: string | null
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
		/** 양수=등급 상승, 음수=등급 하락. 이전 주 데이터가 없으면 null */
		diff: number | null
		diffLabel: string | null
		changed: boolean
	}
	rivalry: NumericDelta
	training: NumericDelta
	/** hasValue가 false면 UI에 '-' 표시, 정렬 시 하단 배치 */
	guildBoss: NumericDelta & { hasValue: boolean }
}

export type GuildDashboardData = {
	currentWeek: GuildWeekSnapshot
	previousWeek: GuildWeekSnapshot
	comparisons: GuildMemberComparison[]
}
