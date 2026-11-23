import GuildDetailSectionSkeleton from '@/features/guild/components/guild-detail-section-skeleton'

/**
 * `[section]` 간 이동 시 본문만 스켈레톤.
 * Marquee·탭은 상위 layout에 남아 리마운트되지 않습니다.
 */
function GuildDetailSectionLoading() {
	return <GuildDetailSectionSkeleton />
}

export default GuildDetailSectionLoading
