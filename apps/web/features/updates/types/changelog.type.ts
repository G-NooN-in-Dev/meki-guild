/** 구역 안 한 줄. children이 있으면 하위 설명으로 들여 씁니다. */
type ChangelogItem = {
	text: string
	children?: readonly ChangelogItem[]
}

/** 버전 카드 안 구역 (길드 정보 · 정보/팁 · 공통 등) */
type ChangelogSection = {
	title: string
	items: readonly ChangelogItem[]
}

/** 버전 1건. date는 YYYY-MM-DD. 새 버전은 상수 배열 앞에 둡니다. */
type ChangelogEntry = {
	version: string
	date: string
	/** 버전 헤더 아래 한 줄 요약 (선택) */
	summary?: string
	/** HOTFIX 배지 표시 */
	hotfix?: boolean
	sections: readonly ChangelogSection[]
}

export type { ChangelogEntry, ChangelogItem, ChangelogSection }
