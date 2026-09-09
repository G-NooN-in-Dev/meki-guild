/** Google Sheet 멤버 탭 Form / append 공용 스키마 */

const GUILD_SHEET_MEMBER_TABS = ['combatPower', 'expedition', 'rivalry', 'training', 'guildBoss'] as const

type GuildSheetMemberTab = (typeof GUILD_SHEET_MEMBER_TABS)[number]

/** Sheet 헤더 순서. sync 스크립트 REQUIRED_HEADERS 와 동일해야 합니다. */
const GUILD_SHEET_TAB_HEADERS = {
	combatPower: ['collectedAt', 'name', 'level', 'job', 'combatPower'],
	expedition: ['collectedAt', 'name', 'grade', 'placement', 'score'],
	rivalry: ['collectedAt', 'name', 'rivalry'],
	training: ['collectedAt', 'name', 'training'],
	guildBoss: ['collectedAt', 'name', 'guildBoss']
} as const satisfies Record<GuildSheetMemberTab, readonly string[]>

/** Form에서 사용자가 직접 입력하는 필드 (collectedAt·name 제외) */
const GUILD_SHEET_TAB_INPUT_FIELDS = {
	combatPower: ['job', 'level', 'combatPower'],
	expedition: ['grade', 'placement', 'score'],
	rivalry: ['rivalry'],
	training: ['training'],
	guildBoss: ['guildBoss']
} as const satisfies Record<GuildSheetMemberTab, readonly string[]>

const GUILD_SHEET_TAB_LABELS = {
	combatPower: '전투력/레벨/직업',
	expedition: '토벌전',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
} as const satisfies Record<GuildSheetMemberTab, string>

const GUILD_SHEET_FIELD_LABELS = {
	job: '직업',
	level: '레벨',
	combatPower: '전투력',
	grade: '등급',
	placement: '순위',
	score: '점수',
	rivalry: '점수',
	training: '점수',
	guildBoss: '점수'
} as const

/**
 * 전투력·점수 입력 규칙.
 * - `koreanUnit`: 경/조/억/만 단위 문자열로 저장
 * - `trainingScore`: 1,000만 미만 숫자 / 이상은 단위 문자열 (게임 표기와 동일)
 */
const GUILD_SHEET_KOREAN_NUMBER_FIELDS = {
	combatPower: 'koreanUnit',
	score: 'koreanUnit',
	rivalry: 'koreanUnit',
	guildBoss: 'koreanUnit',
	training: 'trainingScore'
} as const satisfies Record<string, 'koreanUnit' | 'trainingScore'>

type GuildSheetKoreanNumberField = keyof typeof GUILD_SHEET_KOREAN_NUMBER_FIELDS

const GUILD_SHEET_KOREAN_NUMBER_PLACEHOLDERS = {
	combatPower: '예: 3021조 238억',
	score: '예: 2479억 8198만',
	rivalry: '예: 1258억 871만',
	guildBoss: '예: 583억 6113만',
	training: '예: 9000000 또는 1000만 101'
} as const satisfies Record<GuildSheetKoreanNumberField, string>

function isGuildSheetKoreanNumberField(field: string): field is GuildSheetKoreanNumberField {
	return field in GUILD_SHEET_KOREAN_NUMBER_FIELDS
}

/** dayjs `.day()` — 0=일 … 6=토 */
const GUILD_SHEET_TAB_WEEKDAY = {
	combatPower: 1,
	expedition: 0,
	rivalry: 1,
	training: 3,
	guildBoss: 3
} as const satisfies Record<GuildSheetMemberTab, number>

const GUILD_SHEET_SEASONAL_TABS = ['rivalry', 'training', 'guildBoss'] as const

type GuildSheetSeasonalTab = (typeof GUILD_SHEET_SEASONAL_TABS)[number]

function isGuildSheetMemberTab(value: string): value is GuildSheetMemberTab {
	return (GUILD_SHEET_MEMBER_TABS as readonly string[]).includes(value)
}

function isGuildSheetSeasonalTab(tab: GuildSheetMemberTab): tab is GuildSheetSeasonalTab {
	return (GUILD_SHEET_SEASONAL_TABS as readonly string[]).includes(tab)
}

export {
	GUILD_SHEET_FIELD_LABELS,
	GUILD_SHEET_KOREAN_NUMBER_FIELDS,
	GUILD_SHEET_KOREAN_NUMBER_PLACEHOLDERS,
	GUILD_SHEET_MEMBER_TABS,
	GUILD_SHEET_SEASONAL_TABS,
	GUILD_SHEET_TAB_HEADERS,
	GUILD_SHEET_TAB_INPUT_FIELDS,
	GUILD_SHEET_TAB_LABELS,
	GUILD_SHEET_TAB_WEEKDAY,
	isGuildSheetKoreanNumberField,
	isGuildSheetMemberTab,
	isGuildSheetSeasonalTab
}
export type { GuildSheetKoreanNumberField, GuildSheetMemberTab, GuildSheetSeasonalTab }
