/** 정보/팁 허브에 노출되는 개별 팁 메타데이터 */
export type TipEntry = {
	/** URL 경로 세그먼트 (예: guild-rivalry-hit-cut) */
	slug: string
	/** 허브 카드·페이지 제목 */
	title: string
	/** 허브 카드 부제 */
	description: string
	/** 분류 태그 (예: 대항전, 토벌전) */
	category: string
	/** 상세 페이지 경로 */
	href: `/tips/${string}`
}
