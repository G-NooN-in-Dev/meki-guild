import { redirect } from 'next/navigation'

import { buildGuildDetailHref, parseGuildDetailSection } from '@/features/guild/lib/guild-detail-nav'

type GuildDetailIndexPageProps = {
	searchParams: Promise<{ section?: string }>
}

/**
 * 섹션 없는 상세 진입 → 기본(또는 구 `?section=`) 항목 path로 보냅니다.
 * 예전 쿼리 링크도 세그먼트 경로로 이어집니다.
 */
async function GuildDetailIndexPage({ searchParams }: GuildDetailIndexPageProps) {
	const { section } = await searchParams
	redirect(buildGuildDetailHref(parseGuildDetailSection(section)))
}

export default GuildDetailIndexPage
