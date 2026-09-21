/** 예측에 필요한 최소 길드 수 (빈 칸 제외) */
const RANK_PREDICT_MIN_GUILDS = 2

/** 길드 행 pastel 톤. 기본 /50, hover 시 불투명 */
const RANK_PREDICT_ROW_TONE = {
	red: 'bg-pastel-red-100/50 hover:bg-pastel-red-100',
	orange: 'bg-pastel-orange-100/50 hover:bg-pastel-orange-100',
	yellow: 'bg-pastel-yellow-100/50 hover:bg-pastel-yellow-100',
	green: 'bg-pastel-green-100/50 hover:bg-pastel-green-100',
	blue: 'bg-pastel-blue-100/50 hover:bg-pastel-blue-100',
	navy: 'bg-pastel-navy-100/50 hover:bg-pastel-navy-100',
	purple: 'bg-pastel-purple-100/50 hover:bg-pastel-purple-100'
} as const satisfies Record<string, string>

/**
 * 참가 길드 수별 행 색 순서.
 * 대항전(최대 5)·수련장(최대 7)이 같은 맵을 씁니다.
 */
const RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT = {
	2: [RANK_PREDICT_ROW_TONE.red, RANK_PREDICT_ROW_TONE.blue],
	3: [RANK_PREDICT_ROW_TONE.red, RANK_PREDICT_ROW_TONE.green, RANK_PREDICT_ROW_TONE.blue],
	4: [
		RANK_PREDICT_ROW_TONE.orange,
		RANK_PREDICT_ROW_TONE.green,
		RANK_PREDICT_ROW_TONE.blue,
		RANK_PREDICT_ROW_TONE.purple
	],
	5: [
		RANK_PREDICT_ROW_TONE.red,
		RANK_PREDICT_ROW_TONE.orange,
		RANK_PREDICT_ROW_TONE.green,
		RANK_PREDICT_ROW_TONE.blue,
		RANK_PREDICT_ROW_TONE.purple
	],
	6: [
		RANK_PREDICT_ROW_TONE.red,
		RANK_PREDICT_ROW_TONE.orange,
		RANK_PREDICT_ROW_TONE.yellow,
		RANK_PREDICT_ROW_TONE.green,
		RANK_PREDICT_ROW_TONE.blue,
		RANK_PREDICT_ROW_TONE.purple
	],
	7: [
		RANK_PREDICT_ROW_TONE.red,
		RANK_PREDICT_ROW_TONE.orange,
		RANK_PREDICT_ROW_TONE.yellow,
		RANK_PREDICT_ROW_TONE.green,
		RANK_PREDICT_ROW_TONE.blue,
		RANK_PREDICT_ROW_TONE.navy,
		RANK_PREDICT_ROW_TONE.purple
	]
} as const satisfies Record<number, readonly string[]>

type RankPredictGuildCount = keyof typeof RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT

function getPredictGuildRowPalette(guildCount: number): readonly string[] {
	if (guildCount in RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT) {
		return RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT[guildCount as RankPredictGuildCount]
	}

	return RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT[7]
}

function getPredictGuildRowClass(guildIndex: number, guildCount: number): string {
	const palette = getPredictGuildRowPalette(guildCount)

	return palette[guildIndex]!
}

export { getPredictGuildRowClass, RANK_PREDICT_GUILD_ROW_CLASS_BY_COUNT, RANK_PREDICT_MIN_GUILDS }
