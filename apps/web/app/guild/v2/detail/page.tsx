import { redirect } from 'next/navigation'

import { buildGuildDetailHref, parseGuildDetailSection } from '@/features/guild-v2/lib/guild-detail-nav'

type GuildV2DetailIndexPageProps = {
	searchParams: Promise<{ section?: string }>
}

/**
 * 섹션 없는 상세 진입 → 기본(또는 구 `?section=`) 항목 path로 보냅니다.
 * 예전 쿼리 링크도 세그먼트 경로로 이어집니다.
 */
async function GuildV2DetailIndexPage({ searchParams }: GuildV2DetailIndexPageProps) {
	const { section } = await searchParams
	redirect(buildGuildDetailHref(parseGuildDetailSection(section)))
}

export default GuildV2DetailIndexPage
