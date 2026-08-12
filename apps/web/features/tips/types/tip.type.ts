/** 정보/팁 허브에 노출되는 개별 팁 메타데이터 */
type TipEntry = {
	/** URL 경로 세그먼트 (예: guild-rivalry-hit-cut) */
	slug: string
	/** 허브 카드·페이지 제목 */
	title: string
	/** 허브 카드 부제 */
	description: string
	/** 카드·필터용 태그 (예: 대항전, 파티퀘스트) */
	tags: readonly string[]
	/** 상세 페이지 경로 */
	href: `/tips/${string}`
}

export type { TipEntry }
