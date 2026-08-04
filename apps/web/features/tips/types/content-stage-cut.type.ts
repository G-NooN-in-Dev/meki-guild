/** 컨텐츠 난이도 — 일부 컨텐츠는 카오스가 없을 수 있음 */
type ContentDifficulty = 'easy' | 'normal' | 'hard' | 'chaos'

/** 컨텐츠 종류 (파티퀘스트 / 보스레이드) */
type ContentKind = 'party-quest' | 'boss-raid'

/** 난이도별 스테이지컷. 없는 난이도는 null */
type StageCutByDifficulty = {
	easy: string
	normal: string
	hard: string
	/** 카오스 미제공 컨텐츠는 null */
	chaos: string | null
}

/** 허브·표에 쓰는 컨텐츠 한 줄 데이터 */
type ContentStageCutEntry = {
	/** 컨텐츠 표시명 */
	name: string
	/** 클리어 보상 장비 라벨 */
	rewards: readonly string[]
	kind: ContentKind
	stageCuts: StageCutByDifficulty
}

export type { ContentDifficulty, ContentKind, ContentStageCutEntry, StageCutByDifficulty }
