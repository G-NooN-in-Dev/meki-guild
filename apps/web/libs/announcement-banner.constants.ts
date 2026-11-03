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
	// NOTE - 배너 내용
	{
		kind: 'text',
		label: '당분간 업데이트가 천천히 진행됩니다. 양해 부탁드립니다.'
	},
	{
		kind: 'link',
		label: '10월 15일 (목) 패치노트',
		href: 'https://forum.nexon.com/maplestoryidle-kr/board_view?thread=3563013&board=6698'
	},
	{
		kind: 'text',
		label: '당분간 업데이트가 천천히 진행됩니다. 양해 부탁드립니다.'
	},
	{
		kind: 'link',
		label: '11월 5일 (목) 업데이트 미리보기',
		href: 'https://forum.nexon.com/maplestoryidle-kr/board_view?thread=3572656&board=6633'
	}
] satisfies AnnouncementBannerItem[]

/** 배너 표시 여부 */
function hasAnnouncementBanner(): boolean {
	return ANNOUNCEMENT_BANNER_ITEMS.length > 0
}

/** 헤더(h-14) + 배너(h-8) 합산 — layout body padding-top */
const ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS = 'pt-22'

export { ANNOUNCEMENT_BANNER_BODY_PADDING_CLASS, ANNOUNCEMENT_BANNER_ITEMS, hasAnnouncementBanner }
export type { AnnouncementBannerItem }
