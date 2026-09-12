import type { RelicGrade } from '@/features/tips/types/relic.type'

type RelicCatalogEntry = {
	name: string
	grade: RelicGrade
	iconKey: string
}

/** 유물 원본 목록 */
const RELIC_CATALOG_SOURCE: readonly RelicCatalogEntry[] = [
	{ name: '죽은 자의 부적', grade: 'epic', iconKey: 'charm-of-the-dead' },
	{ name: '돼지의 리본', grade: 'epic', iconKey: 'pig-ribbon' },
	{ name: '무녀의 구슬', grade: 'epic', iconKey: 'shaman-orb' },
	{ name: '어둠의 계약서', grade: 'epic', iconKey: 'dark-contract' },
	{ name: '무지개색 달팽이 등껍질', grade: 'unique', iconKey: 'rainbow-snail-shell' },
	{ name: '육각 수정 목걸이', grade: 'unique', iconKey: 'hex-crystal-necklace' },
	{ name: '아르웬의 유리구두', grade: 'unique', iconKey: 'arwen-glass-slipper' },
	{ name: '머쉬맘의 갓', grade: 'unique', iconKey: 'mushmom-hat' },
	{ name: '맑은 샘물', grade: 'unique', iconKey: 'clear-spring-water' },
	{ name: '헬레나의 오래된 장갑', grade: 'unique', iconKey: 'helenas-old-gloves' },
	{ name: '자쿰의 돌조각', grade: 'unique', iconKey: 'zakum-stone-fragment' },
	{ name: '혼테일의 비늘', grade: 'unique', iconKey: 'horntail-scale' },
	{ name: '핑크빈의 왕갈비', grade: 'unique', iconKey: 'pink-bean-rib' },
	{ name: '성배', grade: 'legendary', iconKey: 'holy-grail' },
	{ name: '낡은 오르골', grade: 'legendary', iconKey: 'old-music-box' },
	{ name: '은 펜던트', grade: 'legendary', iconKey: 'silver-pendant' },
	{ name: '별의 돌', grade: 'legendary', iconKey: 'star-stone' },
	{ name: '고대의 책', grade: 'legendary', iconKey: 'ancient-book' },
	{ name: '월로', grade: 'legendary', iconKey: 'will-o-wisp' },
	{ name: '화염초', grade: 'legendary', iconKey: 'flame-grass' },
	{ name: '영혼의 계약서', grade: 'legendary', iconKey: 'soul-contract' },
	{ name: '불이 켜진 램프', grade: 'legendary', iconKey: 'lit-lamp' },
	{ name: '영혼의 주머니', grade: 'legendary', iconKey: 'soul-pouch' },
	{ name: '고대문서 조각', grade: 'legendary', iconKey: 'ancient-document-fragment' },
	{ name: '얼음의 영혼석', grade: 'legendary', iconKey: 'ice-soul-stone' },
	{ name: '불타는 용암', grade: 'legendary', iconKey: 'burning-lava' },
	{ name: '세이람의 목걸이', grade: 'legendary', iconKey: 'cygnus-necklace' },
	{ name: '감정의 물병', grade: 'legendary', iconKey: 'bottle-of-emotions' },
	{ name: '천도나무용 명약', grade: 'legendary', iconKey: 'celestial-dragon-elixir' },
	{ name: '양초', grade: 'legendary', iconKey: 'candle' },
	{ name: '동맹의 증표', grade: 'legendary', iconKey: 'alliance-emblem' },
	{ name: '뿔피리', grade: 'legendary', iconKey: 'horn-flute' },
	{ name: '저주받은 인형', grade: 'legendary', iconKey: 'cursed-doll' },
	{ name: '레인디어의 창', grade: 'legendary', iconKey: 'reindeer-spear' },
	{ name: '비밀 지도', grade: 'legendary', iconKey: 'secret-map' },
	{ name: '순환의 고리', grade: 'legendary', iconKey: 'circulation-ring' }
] as const satisfies readonly {
	name: string
	grade: RelicGrade
	iconKey: string
}[]

/**
 * 유물 이름 → public/relics 파일명 키.
 * 등급별 이미지는 없고 유물당 PNG 1장입니다.
 */

export { RELIC_CATALOG_SOURCE }
