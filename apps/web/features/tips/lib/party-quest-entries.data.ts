import type {
	PartyQuestEntry,
	PartyQuestEquipmentReward,
	PartyQuestMaterialReward
} from '@/features/tips/types/party-quest.type'

/** 재화·재료 이미지 — `public/items/` */
const PARTY_QUEST_MATERIAL_IMAGE_SRC = {
	'시간 단축 티켓': '/items/time-reduce-ticket.png',
	'주문의 흔적': '/items/spell-trace.png',
	'무기 강화석': '/items/weapon-stone.png',
	'엘리트 몬스터 소환 포인트': '/items/elite-monster-point.png',
	메소: '/items/meso.png'
} as const satisfies Record<string, `/items/${string}.png`>

/** 장비 이미지 — `public/equipments/` */
const PARTY_QUEST_EQUIPMENT_IMAGE_SRC = {
	'물컹물컹한 반지': '/equipments/party-quest-ring.png',
	'금이 간 목걸이': '/equipments/party-quest-necklace.png',
	'응축된 힘의 결정석': '/equipments/party-quest-face-accessory.png',
	'연금술사의 반지': '/equipments/party-quest-alchemist-ring.png'
} as const satisfies Record<string, `/equipments/${string}.png`>

/** 난이도별 시간 단축 티켓 확률 — 쉬움 5%, 보통~카오스 10% */
function ticketRatePercent(difficulty: PartyQuestEntry['difficulty']) {
	return difficulty === 'easy' ? 5 : 10
}

/** 기타 재화 한 세트 생성 */
function materials(
	difficulty: PartyQuestEntry['difficulty'],
	quantities: {
		ticket: number
		spellTrace: number
		weaponStone: number
		elitePoint: number
		meso: number
	}
): readonly PartyQuestMaterialReward[] {
	return [
		{
			kind: 'material',
			name: '시간 단축 티켓',
			quantity: quantities.ticket,
			imageSrc: PARTY_QUEST_MATERIAL_IMAGE_SRC['시간 단축 티켓'],
			ratePercent: ticketRatePercent(difficulty)
		},
		{
			kind: 'material',
			name: '주문의 흔적',
			quantity: quantities.spellTrace,
			imageSrc: PARTY_QUEST_MATERIAL_IMAGE_SRC['주문의 흔적'],
			ratePercent: 5
		},
		{
			kind: 'material',
			name: '무기 강화석',
			quantity: quantities.weaponStone,
			imageSrc: PARTY_QUEST_MATERIAL_IMAGE_SRC['무기 강화석'],
			ratePercent: 10
		},
		{
			kind: 'material',
			name: '엘리트 몬스터 소환 포인트',
			quantity: quantities.elitePoint,
			imageSrc: PARTY_QUEST_MATERIAL_IMAGE_SRC['엘리트 몬스터 소환 포인트'],
			ratePercent: 25
		},
		{
			kind: 'material',
			name: '메소',
			quantity: quantities.meso,
			imageSrc: PARTY_QUEST_MATERIAL_IMAGE_SRC.메소,
			ratePercent: 30
		}
	]
}

function equipment(
	name: keyof typeof PARTY_QUEST_EQUIPMENT_IMAGE_SRC,
	grade: PartyQuestEquipmentReward['grade'],
	tier: PartyQuestEquipmentReward['tier'],
	maxLevel: number
): PartyQuestEquipmentReward {
	return {
		kind: 'equipment',
		name,
		grade,
		tier,
		maxLevel,
		imageSrc: PARTY_QUEST_EQUIPMENT_IMAGE_SRC[name]
	}
}

/**
 * 파티퀘스트 명중컷·보상 원본 데이터.
 * 장비 획득 확률은 난이도 공통(`party-quest.constants`)에서 조회한다.
 */
const PARTY_QUEST_ENTRIES = [
	// 첫 번째 동행
	{
		quest: 'ring',
		difficulty: 'easy',
		requiredHit: 65,
		equipment: equipment('물컹물컹한 반지', 'epic', 'high', 50),
		materials: materials('easy', {
			ticket: 2,
			spellTrace: 30,
			weaponStone: 700,
			elitePoint: 20,
			meso: 2000
		})
	},
	{
		quest: 'ring',
		difficulty: 'normal',
		requiredHit: 110,
		equipment: equipment('물컹물컹한 반지', 'unique', 'high', 75),
		materials: materials('normal', {
			ticket: 2,
			spellTrace: 50,
			weaponStone: 1000,
			elitePoint: 30,
			meso: 3000
		})
	},
	{
		quest: 'ring',
		difficulty: 'hard',
		requiredHit: 173,
		equipment: equipment('물컹물컹한 반지', 'legendary', 'low', 90),
		materials: materials('hard', {
			ticket: 2,
			spellTrace: 60,
			weaponStone: 1400,
			elitePoint: 40,
			meso: 4000
		})
	},
	{
		quest: 'ring',
		difficulty: 'chaos',
		requiredHit: 240,
		equipment: equipment('물컹물컹한 반지', 'legendary', 'mid', 105),
		materials: materials('chaos', {
			ticket: 2,
			spellTrace: 65,
			weaponStone: 1700,
			elitePoint: 45,
			meso: 4500
		})
	},

	// 차원의 균열
	{
		quest: 'necklace',
		difficulty: 'easy',
		requiredHit: 146,
		equipment: equipment('금이 간 목걸이', 'unique', 'high', 80),
		materials: materials('easy', {
			ticket: 2,
			spellTrace: 55,
			weaponStone: 1200,
			elitePoint: 35,
			meso: 3500
		})
	},
	{
		quest: 'necklace',
		difficulty: 'normal',
		requiredHit: 182,
		equipment: equipment('금이 간 목걸이', 'unique', 'top', 95),
		materials: materials('normal', {
			ticket: 2,
			spellTrace: 60,
			weaponStone: 1400,
			elitePoint: 40,
			meso: 4000
		})
	},
	{
		quest: 'necklace',
		difficulty: 'hard',
		requiredHit: 227,
		equipment: equipment('금이 간 목걸이', 'legendary', 'low', 105),
		materials: materials('hard', {
			ticket: 2,
			spellTrace: 65,
			weaponStone: 1600,
			elitePoint: 45,
			meso: 4500
		})
	},
	{
		quest: 'necklace',
		difficulty: 'chaos',
		requiredHit: 272,
		equipment: equipment('금이 간 목걸이', 'legendary', 'mid', 115),
		materials: materials('chaos', {
			ticket: 2,
			spellTrace: 70,
			weaponStone: 1800,
			elitePoint: 50,
			meso: 5000
		})
	},

	// 여신의 흔적
	{
		quest: 'faceAccessory',
		difficulty: 'easy',
		requiredHit: 156,
		equipment: equipment('응축된 힘의 결정석', 'unique', 'top', 85),
		materials: materials('easy', {
			ticket: 2,
			spellTrace: 60,
			weaponStone: 1300,
			elitePoint: 40,
			meso: 4000
		})
	},
	{
		quest: 'faceAccessory',
		difficulty: 'normal',
		requiredHit: 206,
		equipment: equipment('응축된 힘의 결정석', 'legendary', 'low', 100),
		materials: materials('normal', {
			ticket: 2,
			spellTrace: 65,
			weaponStone: 1500,
			elitePoint: 45,
			meso: 4500
		})
	},
	{
		quest: 'faceAccessory',
		difficulty: 'hard',
		requiredHit: 266,
		equipment: equipment('응축된 힘의 결정석', 'legendary', 'mid', 110),
		materials: materials('hard', {
			ticket: 2,
			spellTrace: 70,
			weaponStone: 1700,
			elitePoint: 50,
			meso: 5000
		})
	},
	{
		quest: 'faceAccessory',
		difficulty: 'chaos',
		requiredHit: 316,
		equipment: equipment('응축된 힘의 결정석', 'legendary', 'high', 120),
		materials: materials('chaos', {
			ticket: 2,
			spellTrace: 75,
			weaponStone: 1900,
			elitePoint: 55,
			meso: 5500
		})
	},

	// 로미오와 줄리엣 (카오스 없음)
	{
		quest: 'ring2',
		difficulty: 'easy',
		requiredHit: 205,
		equipment: equipment('연금술사의 반지', 'legendary', 'low', 100),
		materials: materials('easy', {
			ticket: 2,
			spellTrace: 65,
			weaponStone: 1450,
			elitePoint: 45,
			meso: 4300
		})
	},
	{
		quest: 'ring2',
		difficulty: 'normal',
		requiredHit: 266,
		equipment: equipment('연금술사의 반지', 'legendary', 'mid', 110),
		materials: materials('normal', {
			ticket: 2,
			spellTrace: 70,
			weaponStone: 1650,
			elitePoint: 50,
			meso: 4800
		})
	},
	{
		quest: 'ring2',
		difficulty: 'hard',
		requiredHit: 316,
		equipment: equipment('연금술사의 반지', 'legendary', 'high', 120),
		materials: materials('hard', {
			ticket: 2,
			spellTrace: 75,
			weaponStone: 1850,
			elitePoint: 55,
			meso: 5300
		})
	}
] as const satisfies readonly PartyQuestEntry[]

export { PARTY_QUEST_ENTRIES }
