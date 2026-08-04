/**
 * 길드 지표 UI 표시 여부.
 * 데이터 수집 주기가 길어 당분간 숨길 지표는 false로 둡니다.
 * 다시 노출할 때는 해당 키만 true로 바꾸면 됩니다.
 *
 * 데이터·타입·스냅샷 로더는 그대로 두고, 화면 노출만 제어합니다.
 */
export const GUILD_METRIC_VISIBILITY = {
	training: true,
	guildBoss: false
} as const

/** UI에서 on/off 가능한 지표 키 */
type HideableGuildMetricKey = keyof typeof GUILD_METRIC_VISIBILITY

/** 해당 지표를 화면에 보여줄지 여부 */
function isGuildMetricVisible(key: HideableGuildMetricKey): boolean {
	return GUILD_METRIC_VISIBILITY[key]
}

export { isGuildMetricVisible }
export type { HideableGuildMetricKey }
