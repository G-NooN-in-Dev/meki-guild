import GuildDetailSectionSkeleton from '@/features/guild-v2/components/guild-detail-section-skeleton'

/**
 * `[section]` 간 이동 시 본문만 스켈레톤.
 * Marquee·탭은 상위 layout에 남아 리마운트되지 않습니다.
 */
function GuildV2DetailSectionLoading() {
	return <GuildDetailSectionSkeleton />
}

export default GuildV2DetailSectionLoading
