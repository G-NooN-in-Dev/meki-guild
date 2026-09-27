/** mgf.gg character.php 에서 파싱한 캐릭터 프로필 */
type MgfCharacterDto = {
	name: string
	/** same-origin 초상화 프록시 경로 (`/api/tips/character-portrait?n=…`) */
	portraitUrl: string | null
	/** 인기도 (♥). 없으면 null */
	popularity: number | null
	guildName: string | null
	level: number
	job: string
	/** 전투력 원값 (문자열 bigint) */
	combatPower: string
	combatPowerLabel: string
	/** 전체 랭킹 (1부터). 없으면 null */
	globalRank: number | null
	/** 서버 라벨. 예: Scania 1 */
	serverLabel: string | null
	/** 해당 서버 내 랭킹 */
	serverRank: number | null
	weapon: string | null
	expedition: MgfCharacterBossDto | null
	worldBoss: MgfCharacterBossDto | null
}

/** 토벌전·월드보스 공통 (등급은 등수 데이터로 수동으로 계산) */
type MgfCharacterBossDto = {
	/** 점수 원값 (문자열 bigint) */
	score: string
	scoreLabel: string
	rank: number | null
}

/** 1 vs 1 비교에서 우세한 쪽 */
type CharacterCompareWinner = 'left' | 'right' | 'tie'

type CharacterCompareSide = 'left' | 'right'

type CharacterCompareNumericField = {
	left: bigint
	right: bigint
	leftLabel: string
	rightLabel: string
	diff: bigint
	diffLabel: string | null
	winner: CharacterCompareWinner
	leftHasValue: boolean
	rightHasValue: boolean
}

type CharacterCompareLevelField = {
	left: number
	right: number
	leftLabel: string
	rightLabel: string
	diff: number
	diffLabel: string | null
	winner: CharacterCompareWinner
}

/** 인기도처럼 값이 없을 수 있는 숫자 지표 */
type CharacterCompareNullableNumberField = {
	left: number | null
	right: number | null
	leftLabel: string
	rightLabel: string
	diff: number | null
	diffLabel: string | null
	winner: CharacterCompareWinner
	leftHasValue: boolean
	rightHasValue: boolean
}

type CharacterCompareRankField = {
	left: number | null
	right: number | null
	leftLabel: string
	rightLabel: string
	diff: number | null
	diffLabel: string | null
	winner: CharacterCompareWinner
	leftHasValue: boolean
	rightHasValue: boolean
}

type CharacterCompareTextField = {
	leftLabel: string
	rightLabel: string
	/** 텍스트 필드는 승패를 두지 않습니다 */
	winner: 'tie'
}

/** 토벌전·월드보스·무기 등급 */
type CharacterCompareGradeField = {
	left: string
	right: string
	leftLabel: string
	rightLabel: string
	diff: number | null
	diffLabel: string | null
	winner: CharacterCompareWinner
	leftHasValue: boolean
	rightHasValue: boolean
}

type CharacterCompareResult = {
	left: MgfCharacterDto
	right: MgfCharacterDto
	globalRank: CharacterCompareRankField
	serverLabel: CharacterCompareTextField
	serverRank: CharacterCompareRankField
	popularity: CharacterCompareNullableNumberField
	level: CharacterCompareLevelField
	combatPower: CharacterCompareNumericField
	weapon: CharacterCompareGradeField
	expeditionGrade: CharacterCompareGradeField
	expeditionRank: CharacterCompareRankField
	expeditionScore: CharacterCompareNumericField
	worldBossGrade: CharacterCompareGradeField
	worldBossRank: CharacterCompareRankField
	worldBossScore: CharacterCompareNumericField
}

export type {
	CharacterCompareGradeField,
	CharacterCompareLevelField,
	CharacterCompareNullableNumberField,
	CharacterCompareNumericField,
	CharacterCompareRankField,
	CharacterCompareResult,
	CharacterCompareSide,
	CharacterCompareTextField,
	CharacterCompareWinner,
	MgfCharacterBossDto,
	MgfCharacterDto
}
