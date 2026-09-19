/** 정보/팁 허브 카테고리 식별자 */
type TipCategoryId = 'info' | 'growth-adventure' | 'guild-contents' | 'predict-calculator'

/** 카테고리 메타 (표시명·순서) */
type TipCategory = {
	id: TipCategoryId
	label: string
}

/** 정보/팁 허브에 노출되는 개별 팁 메타데이터 */
type TipEntry = {
	/** URL 경로 세그먼트 (예: guild-rivalry-hit-cut) */
	slug: string
	/** 허브 카드·페이지 제목 */
	title: string
	/** 허브 카드 부제 */
	description: string
	/** 허브 카테고리 */
	category: TipCategoryId
	/** 상세 페이지 Badge용 태그 (카테고리 label 뒤에 이어서 표시) */
	tags: readonly string[]
	/** 상세 페이지 경로 */
	href: `/tips/${string}`
}

/** 허브에 노출할 카테고리 + 소속 팁 묶음 */
type TipCategoryGroup = {
	category: TipCategory
	tips: readonly TipEntry[]
}

export type { TipCategory, TipCategoryGroup, TipCategoryId, TipEntry }
