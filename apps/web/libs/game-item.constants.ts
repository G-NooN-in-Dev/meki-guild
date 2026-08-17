/**
 * 앱 전역에서 쓰는 게임 재화·소모품 메타.
 * 이미지는 `public/items/`에 두고, 페이지마다 경로를 중복 정의하지 않습니다.
 */

type GameItemId = 'meso' | 'journey-coin' | 'starforce-scroll' | 'miracle-cube' | 'additional-cube'

type GameItemMeta = {
	id: GameItemId
	label: string
	/** public 경로. 없으면 아이콘 없이 라벨만 표시 */
	imageSrc: `/items/${string}.png` | null
}

const GAME_ITEM_META = {
	meso: {
		id: 'meso',
		label: '메소',
		imageSrc: '/items/meso.png'
	},
	'journey-coin': {
		id: 'journey-coin',
		label: '여정의 증표',
		imageSrc: '/items/journey-coin.png'
	},
	'starforce-scroll': {
		id: 'starforce-scroll',
		label: '스타포스 주문서',
		imageSrc: '/items/starforce-scroll.png'
	},
	'miracle-cube': {
		id: 'miracle-cube',
		label: '미라클 큐브',
		imageSrc: '/items/miracle-cube.png'
	},
	'additional-cube': {
		id: 'additional-cube',
		label: '에디셔널 큐브',
		imageSrc: '/items/additional-cube.png'
	}
} as const satisfies Record<GameItemId, GameItemMeta>

function getGameItemMeta(itemId: GameItemId) {
	return GAME_ITEM_META[itemId]
}

export { GAME_ITEM_META, getGameItemMeta }
export type { GameItemId, GameItemMeta }
