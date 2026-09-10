import type { BossRaidEntry, BossRaidMaterialReward, BossRaidRewardTier } from '@/features/tips/types/boss-raid.type'

/** 재화·재료 이미지 — `public/items/` */
const BOSS_RAID_MATERIAL_IMAGE_SRC = {
	'시간 단축 티켓': '/items/time-reduce-ticket.png',
	'주문의 흔적': '/items/spell-trace.png',
	'무기 강화석': '/items/weapon-stone.png',
	'엘리트 몬스터 소환 포인트': '/items/elite-monster-point.png',
	메소: '/items/meso.png'
} as const satisfies Record<string, `/items/${string}.png`>

/** 장비 이미지 — `public/equipment/` */
const BOSS_RAID_EQUIPMENT_IMAGE_SRC = {
	'자쿰의 투구': '/equipments/zakum-helmet.png',
	'카오스 자쿰의 투구': '/equipments/zakum-helmet.png',
	'아쿠아틱 레터 눈장식': '/equipments/aquatic-letter-eye-accessory.png',
	'데아 시두스 이어링': '/equipments/dea-sidus-ear-ring.png',
	'혼테일의 목걸이': '/equipments/horntail-necklace.png',
	'카오스 혼테일의 목걸이': '/equipments/chaos-horntail-necklace.png',
	'핑크빛 성배': '/equipments/pink-bean-holy-grail.png',
	'블랙빈 마크': '/equipments/pink-bean-black-bean-mark.png',
	'카오스 핑크빈 마크': '/equipments/chaos-pink-bean-mark.png'
} as const satisfies Record<string, `/equipments/${string}.png`>

/** 주문서 티어별 이미지 — `public/items/` */
const BOSS_RAID_SCROLL_TIER_IMAGE_SRC = {
	low: '/items/scroll-gray.png',
	mid: '/items/scroll-brown.png'
} as const satisfies Partial<Record<BossRaidRewardTier, `/items/${string}.png`>>

/** 훈장 이미지 — `public/items/` */
const BOSS_RAID_MEDAL_IMAGE_SRC = {
	'팀플레이어 훈장': '/medals/team-player-medal.jpg',
	'혼테일 원정대 훈장': '/medals/horntail-expedition-medal.jpg'
} as const satisfies Record<string, `/medals/${string}.jpg`>

/** 대부분 난이도에 공통으로 나오는 재화·재료 */
const COMMON_BOSS_RAID_MATERIALS = [
	{
		kind: 'material',
		name: '시간 단축 티켓',
		quantity: 200,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['시간 단축 티켓'],
		ratePercent: 3
	},
	{
		kind: 'material',
		name: '주문의 흔적',
		quantity: 400,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['주문의 흔적'],
		ratePercent: 7
	},
	{
		kind: 'material',
		name: '무기 강화석',
		quantity: 20_000,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['무기 강화석'],
		ratePercent: 10
	},
	{
		kind: 'material',
		name: '엘리트 몬스터 소환 포인트',
		quantity: 400,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC['엘리트 몬스터 소환 포인트'],
		ratePercent: 16
	},
	{
		kind: 'material',
		name: '메소',
		quantity: 100_000,
		imageSrc: BOSS_RAID_MATERIAL_IMAGE_SRC.메소,
		ratePercent: 35
	}
] as const satisfies readonly BossRaidMaterialReward[]

/**
 * 보스레이드 명중컷·보상 원본 데이터.
 * rewards 배열 순서는 입력 순서이며, UI에서 그룹·정렬합니다.
 */
const BOSS_RAID_ENTRIES = [
	{
		boss: 'zakum',
		difficulty: 'easy',
		requiredHit: 110,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'high',
				maxLevel: 80,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'high',
				maxLevel: 80,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 4
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'normal',
		requiredHit: 150,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'hard',
		requiredHit: 230,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'chaos',
		requiredHit: 330,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구'],
				ratePercent: 5
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'mid',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식'],
				ratePercent: 20
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'zakum',
		difficulty: 'guild',
		requiredHit: 190,
		rewardMode: 'milestone',
		milestones: [
			{
				hpPercent: 10,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 20,
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식']
			},
			{
				hpPercent: 30,
				kind: 'equipment',
				grade: 'unique',
				tier: 'top',
				maxLevel: 95,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구']
			},
			{
				hpPercent: 40,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 50,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 60,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '아쿠아틱 레터 눈장식',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['아쿠아틱 레터 눈장식']
			},
			{
				hpPercent: 70,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'low',
				maxLevel: 110,
				name: '자쿰의 투구',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['자쿰의 투구']
			},
			{
				hpPercent: 80,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 90,
				kind: 'scroll',
				scrollName: '자쿰의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 100,
				kind: 'medal',
				name: '팀플레이어 훈장',
				imageSrc: BOSS_RAID_MEDAL_IMAGE_SRC['팀플레이어 훈장']
			}
		]
	},
	{
		boss: 'horntail',
		difficulty: 'easy',
		requiredHit: 240,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'mid',
				maxLevel: 105,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 4
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'normal',
		requiredHit: 330,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'hard',
		requiredHit: 420,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 125,
				name: '카오스 혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['카오스 혼테일의 목걸이'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 125,
				name: '혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['혼테일의 목걸이'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'chaos',
		requiredHit: 510,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 125,
				name: '카오스 혼테일의 목걸이',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['카오스 혼테일의 목걸이'],
				ratePercent: 5
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링'],
				ratePercent: 20
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'horntail',
		difficulty: 'guild',
		requiredHit: 340,
		rewardMode: 'milestone',
		milestones: [
			{
				hpPercent: 10,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 20,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 30,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 115,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 40,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 50,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 60,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 70,
				kind: 'equipment',
				grade: 'legendary',
				tier: 'top',
				maxLevel: 125,
				name: '데아 시두스 이어링',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['데아 시두스 이어링']
			},
			{
				hpPercent: 80,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'low',
				quantity: 3,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low
			},
			{
				hpPercent: 90,
				kind: 'scroll',
				scrollName: '혼테일의 주문서',
				tier: 'mid',
				quantity: 2,
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid
			},
			{
				hpPercent: 100,
				kind: 'medal',
				name: '혼테일 원정대 훈장',
				imageSrc: BOSS_RAID_MEDAL_IMAGE_SRC['혼테일 원정대 훈장']
			}
		]
	},
	{
		boss: 'pinkBean',
		difficulty: 'easy',
		requiredHit: 360,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 120,
				name: '핑크빛 성배',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['핑크빛 성배'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendary',
				tier: 'high',
				maxLevel: 110,
				name: '핑크빛 성배',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['핑크빛 성배'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '핑크빈의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 4
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'pinkBean',
		difficulty: 'normal',
		requiredHit: 450,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 130,
				name: '핑크빛 성배',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['핑크빛 성배'],
				ratePercent: 2
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'low',
				maxLevel: 120,
				name: '핑크빛 성배',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['핑크빛 성배'],
				ratePercent: 23
			},
			{
				kind: 'scroll',
				scrollName: '핑크빈의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '핑크빈의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	},
	{
		boss: 'pinkBean',
		difficulty: 'hard',
		requiredHit: 540,
		rewardMode: 'probability',
		rewards: [
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'top',
				maxLevel: 130,
				name: '카오스 핑크빈 마크',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['카오스 핑크빈 마크'],
				ratePercent: 1
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'high',
				maxLevel: 130,
				name: '블랙빈 마크',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['블랙빈 마크'],
				ratePercent: 9
			},
			{
				kind: 'equipment',
				grade: 'legendaryPlus',
				tier: 'mid',
				maxLevel: 130,
				name: '핑크빛 성배',
				imageSrc: BOSS_RAID_EQUIPMENT_IMAGE_SRC['핑크빛 성배'],
				ratePercent: 15
			},
			{
				kind: 'scroll',
				scrollName: '핑크빈의 주문서',
				tier: 'mid',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.mid,
				ratePercent: 1
			},
			{
				kind: 'scroll',
				scrollName: '핑크빈의 주문서',
				tier: 'low',
				imageSrc: BOSS_RAID_SCROLL_TIER_IMAGE_SRC.low,
				ratePercent: 3
			},
			...COMMON_BOSS_RAID_MATERIALS
		]
	}
] as const satisfies readonly BossRaidEntry[]

/** boss × difficulty 조회 */

export { BOSS_RAID_ENTRIES }
