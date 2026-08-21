/**
 * 번갈아 운영되는 길드 컨텐츠 지표.
 * 배열 순서가 화면 표시 순서입니다. 순서만 바꾸면 전 UI에 반영됩니다.
 * 새 컨텐츠는 이 배열에 항목을 추가하면 됩니다.
 */
const GUILD_CONTENTS_ORDER = [
	{ key: 'guildBoss', label: '길드보스' },
	{ key: 'training', label: '수련장' }
] as const

type GuildContentsOrderKey = (typeof GUILD_CONTENTS_ORDER)[number]['key']

type GuildContentsOrderItem = (typeof GUILD_CONTENTS_ORDER)[number]

/** 표시 순서대로 길드 컨텐츠 목록 */
function getGuildContentsOrder(): readonly GuildContentsOrderItem[] {
	return GUILD_CONTENTS_ORDER
}

/** 표시 순서대로 길드 컨텐츠 키 */
function getGuildContentsOrderKeys(): readonly GuildContentsOrderKey[] {
	return GUILD_CONTENTS_ORDER.map((content) => content.key)
}

export { getGuildContentsOrder, getGuildContentsOrderKeys, GUILD_CONTENTS_ORDER }
export type { GuildContentsOrderItem, GuildContentsOrderKey }
