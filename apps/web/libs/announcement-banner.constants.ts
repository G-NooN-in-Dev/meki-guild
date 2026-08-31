type AnnouncementBannerTextItem = {
	kind: 'text'
	label: string
}

type AnnouncementBannerLinkItem = {
	kind: 'link'
	label: string
	href: string
}

type AnnouncementBannerItem = AnnouncementBannerTextItem | AnnouncementBannerLinkItem

/**
 * 헤더 아래 마키 배너 항목.
 * 비우면 배너·추가 여백이 모두 숨겨집니다.
 */
const ANNOUNCEMENT_BANNER_ITEMS = [
	{
		kind: 'text',
		label: '메키 업데이트 및 개인 사정으로 인해 사이트 업데이트가 지연될 예정입니다. 양해 부탁드립니다.'
	},
	{
		kind: 'link',
		label: '9월 3일 (목) 업데이트 미리보기',
		href: 'https://forum.nexon.com/maplestoryidle-kr/board_view?thread=3533653&board=6633'
	}
] satisfies AnnouncementBannerItem[]

/** 배너 표시 여부 */
function hasAnnouncementBanner(): boolean {
	return ANNOUNCEMENT_BANNER_ITEMS.length > 0
}

/** 헤더(h-14) + 배너(h-8) 합산 — layout body padding-top */
const ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS = 'pt-22'

export { ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS, ANNOUNCEMENT_BANNER_ITEMS, hasAnnouncementBanner }
export type { AnnouncementBannerItem, AnnouncementBannerLinkItem, AnnouncementBannerTextItem }
