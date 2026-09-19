/** 예측에 필요한 최소 길드 수 (빈 칸 제외) */
const RANK_PREDICT_MIN_GUILDS = 2

/**
 * 길드 인덱스별 행 배경색 (pastel 토큰).
 * 기본은 /50, hover 시 투명도 없이 같은 톤을 씁니다.
 * 대항전(5)·수련장(7) 모두 이 팔레트를 공유합니다.
 */
const RANK_PREDICT_GUILD_ROW_CLASS = [
	'bg-pastel-red-100/50 hover:bg-pastel-red-100',
	'bg-pastel-orange-100/50 hover:bg-pastel-orange-100',
	'bg-pastel-yellow-100/50 hover:bg-pastel-yellow-100',
	'bg-pastel-green-100/50 hover:bg-pastel-green-100',
	'bg-pastel-blue-100/50 hover:bg-pastel-blue-100',
	'bg-pastel-navy-100/50 hover:bg-pastel-navy-100',
	'bg-pastel-purple-100/50 hover:bg-pastel-purple-100'
] as const satisfies readonly string[]

function getPredictGuildRowClass(guildIndex: number): string {
	return RANK_PREDICT_GUILD_ROW_CLASS[guildIndex] ?? RANK_PREDICT_GUILD_ROW_CLASS[0]
}

export { getPredictGuildRowClass, RANK_PREDICT_GUILD_ROW_CLASS, RANK_PREDICT_MIN_GUILDS }
