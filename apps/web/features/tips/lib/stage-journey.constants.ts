import type { StageJourneyChapter, StageJourneyGrade } from '@/features/tips/types/stage-journey.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 등급 표시 순서 (낮은 등급 → 높은 등급) */
const STAGE_JOURNEY_GRADE_ORDER = [
	'normal',
	'rare',
	'epic',
	'unique',
	'legendary',
	'mystic',
	'mysticPlus'
] as const satisfies readonly StageJourneyGrade[]

/** 등급 표시 라벨·Badge 색·확률 */
const STAGE_JOURNEY_GRADE_META = {
	normal: {
		label: '노말',
		probabilityText: '40%',
		badgeClassName: 'border-transparent bg-grayscale-100 text-grayscale-700'
	},
	rare: {
		label: '레어',
		probabilityText: '30%',
		badgeClassName: 'border-transparent bg-pastel-blue-100 text-pastel-blue-800'
	},
	epic: {
		label: '에픽',
		probabilityText: '22%',
		badgeClassName: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800'
	},
	unique: {
		label: '유니크',
		probabilityText: '4%',
		badgeClassName: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800'
	},
	legendary: {
		label: '레전드리',
		probabilityText: '2.5%',
		badgeClassName: 'border-transparent bg-pastel-green-100 text-pastel-green-800'
	},
	mystic: {
		label: '미스틱',
		probabilityText: '1.3%',
		badgeClassName: 'border-transparent bg-pure-red/15 text-danger-700'
	},
	mysticPlus: {
		label: '미스틱+',
		probabilityText: '0.2%',
		badgeClassName: 'border-transparent bg-pure-red/15 text-danger-700'
	}
} as const satisfies Record<StageJourneyGrade, { label: string; probabilityText: string; badgeClassName: string }>

/** 보스 초상화 public 경로 (기본값) */
function getStageJourneyPortraitSrc(chapter: number) {
	return `/tips/stage-boss/stage-boss-${chapter}.gif`
}

/**
 * 용사의 발자취 챕터 목록 (20~44).
 * 클리어 보상·보유 효과 3슬롯·특수 옵션을 챕터별로 둡니다.
 */
const STAGE_JOURNEY_CHAPTERS: readonly StageJourneyChapter[] = [
	{
		chapter: 20,
		name: '구미호',
		rewards: [
			{ itemId: 'journey-coin', amount: 12000 },
			{ itemId: 'starforce-scroll', amount: 20 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 200,
					rare: 400,
					epic: 800,
					unique: 1200,
					legendary: 3000,
					mystic: 9000,
					mysticPlus: 18000
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 1000,
					rare: 2000,
					epic: 4000,
					unique: 6000,
					legendary: 15000,
					mystic: 45000,
					mysticPlus: 90000
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 17,
					rare: 34,
					epic: 68,
					unique: 100,
					legendary: 260,
					mystic: 510,
					mysticPlus: 770
				}
			}
		],
		special: { label: '주 스탯', value: 5, unit: 'percent' }
	},
	{
		chapter: 21,
		name: '선비귀신',
		rewards: [
			{ itemId: 'journey-coin', amount: 15000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 230,
					rare: 460,
					epic: 920,
					unique: 1380,
					legendary: 3450,
					mystic: 10350,
					mysticPlus: 20700
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 1150,
					rare: 2300,
					epic: 4600,
					unique: 6900,
					legendary: 17250,
					mystic: 51750,
					mysticPlus: 103500
				}
			},
			{
				label: '데미지',
				unit: 'percent',
				values: {
					normal: 0.8,
					rare: 1.6,
					epic: 3.2,
					unique: 4.8,
					legendary: 12,
					mystic: 24,
					mysticPlus: 30
				}
			}
		],
		special: { label: '보스 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 22,
		name: '데우',
		rewards: [
			{ itemId: 'journey-coin', amount: 19000 },
			{ itemId: 'additional-cube', amount: 5 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 260,
					rare: 520,
					epic: 1040,
					unique: 1560,
					legendary: 3900,
					mystic: 11700,
					mysticPlus: 23400
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				isEstimated: true,
				values: {
					normal: 1300,
					rare: 2600,
					epic: 5200,
					unique: 7800,
					legendary: 19500,
					mystic: 58500,
					mysticPlus: 117000
				}
			},
			{
				label: '최대 MP',
				unit: 'flat',
				values: {
					normal: 40,
					rare: 80,
					epic: 160,
					unique: 240,
					legendary: 600,
					mystic: 1200,
					mysticPlus: 1800
				}
			}
		],
		special: { label: '일반 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 23,
		name: '루루모',
		rewards: [
			{ itemId: 'journey-coin', amount: 24000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 290,
					rare: 580,
					epic: 1160,
					unique: 1740,
					legendary: 4350,
					mystic: 13050,
					mysticPlus: 26100
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 1450,
					rare: 2900,
					epic: 5800,
					unique: 8700,
					legendary: 21750,
					mystic: 65250,
					mysticPlus: 130500
				}
			},
			{
				label: '명중',
				unit: 'flat',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 15
				}
			}
		],
		special: { label: '데미지', value: 20, unit: 'percent' }
	},
	{
		chapter: 24,
		name: '자동경비시스템',
		rewards: [
			{ itemId: 'journey-coin', amount: 30000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 320,
					rare: 640,
					epic: 1280,
					unique: 1920,
					legendary: 4800,
					mystic: 14400,
					mysticPlus: 28800
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 1600,
					rare: 3200,
					epic: 6400,
					unique: 9600,
					legendary: 24000,
					mystic: 72000,
					mysticPlus: 144000
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 19,
					rare: 38,
					epic: 76,
					unique: 110,
					legendary: 290,
					mystic: 570,
					mysticPlus: 860
				}
			}
		],
		special: { label: '최대 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 25,
		name: '그리프',
		rewards: [
			{ itemId: 'journey-coin', amount: 37000 },
			{ itemId: 'additional-cube', amount: 5 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 350,
					rare: 700,
					epic: 1400,
					unique: 2100,
					legendary: 5250,
					mystic: 15750,
					mysticPlus: 31500
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 1750,
					rare: 3500,
					epic: 7000,
					unique: 10500,
					legendary: 26250,
					mystic: 78750,
					mysticPlus: 157500
				}
			},
			{
				label: '보스 몬스터 데미지',
				unit: 'percent',
				values: {
					normal: 0.4,
					rare: 0.8,
					epic: 1.6,
					unique: 2.4,
					legendary: 6,
					mystic: 12,
					mysticPlus: 18
				}
			}
		],
		special: { label: '경험치 획득량', value: 7, unit: 'percent' }
	},
	{
		chapter: 26,
		name: '레비아탄',
		rewards: [
			{ itemId: 'journey-coin', amount: 44000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 380,
					rare: 760,
					epic: 1520,
					unique: 2280,
					legendary: 5700,
					mystic: 17100,
					mysticPlus: 34200
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 1900,
					rare: 3800,
					epic: 7600,
					unique: 11400,
					legendary: 28500,
					mystic: 85500,
					mysticPlus: 171000
				}
			},
			{
				label: '방어력',
				unit: 'flat',
				values: {
					normal: 90,
					rare: 180,
					epic: 360,
					unique: 540,
					legendary: 1350,
					mystic: 2700,
					mysticPlus: 4050
				}
			}
		],
		special: { label: '일반 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 27,
		name: '태륜',
		rewards: [
			{ itemId: 'journey-coin', amount: 53000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 410,
					rare: 820,
					epic: 1640,
					unique: 2460,
					legendary: 6150,
					mystic: 18450,
					mysticPlus: 36900
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2050,
					rare: 4100,
					epic: 8200,
					unique: 12300,
					legendary: 30750,
					mystic: 92250,
					mysticPlus: 184500
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 22,
					rare: 44,
					epic: 88,
					unique: 130,
					legendary: 330,
					mystic: 660,
					mysticPlus: 990
				}
			}
		],
		special: { label: '주 스탯', value: 5, unit: 'percent' }
	},
	{
		chapter: 28,
		name: '거대 도라지',
		rewards: [
			{ itemId: 'journey-coin', amount: 63000 },
			{ itemId: 'additional-cube', amount: 5 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 440,
					rare: 880,
					epic: 1760,
					unique: 2640,
					legendary: 6600,
					mystic: 19800,
					mysticPlus: 39600
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2200,
					rare: 4400,
					epic: 8800,
					unique: 13200,
					legendary: 33000,
					mystic: 99000,
					mysticPlus: 198000
				}
			},
			{
				label: '명중',
				unit: 'flat',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 15
				}
			}
		],
		special: { label: '최대 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 29,
		name: '요괴선사',
		rewards: [
			{ itemId: 'journey-coin', amount: 74000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 470,
					rare: 940,
					epic: 1880,
					unique: 2820,
					legendary: 7050,
					mystic: 21150,
					mysticPlus: 42300
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2350,
					rare: 4700,
					epic: 9400,
					unique: 14100,
					legendary: 35250,
					mystic: 105750,
					mysticPlus: 211500
				}
			},
			{
				label: '데미지',
				unit: 'percent',
				values: {
					normal: 0.8,
					rare: 1.6,
					epic: 3.2,
					unique: 4.8,
					legendary: 12,
					mystic: 24,
					mysticPlus: 36
				}
			}
		],
		special: { label: '최소 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 30,
		name: '흰털 대장 원숭이',
		rewards: [
			{ itemId: 'journey-coin', amount: 88000 },
			{ itemId: 'miracle-cube', amount: 10 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 500,
					rare: 1000,
					epic: 2000,
					unique: 3000,
					legendary: 7500,
					mystic: 22500,
					mysticPlus: 45000
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2500,
					rare: 5000,
					epic: 10000,
					unique: 15000,
					legendary: 37500,
					mystic: 112500,
					mysticPlus: 225000
				}
			},
			{
				label: '일반 몬스터 데미지',
				unit: 'percent',
				values: {
					normal: 0.4,
					rare: 0.8,
					epic: 1.6,
					unique: 2.4,
					legendary: 6,
					mystic: 12,
					mysticPlus: 18
				}
			}
		],
		special: { label: '최종 데미지', value: 2.5, unit: 'percent' }
	},
	{
		chapter: 31,
		name: '라바나',
		rewards: [
			{ itemId: 'journey-coin', amount: 105000 },
			{ itemId: 'additional-cube', amount: 5 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 530,
					rare: 1060,
					epic: 2120,
					unique: 3180,
					legendary: 7950,
					mystic: 23850,
					mysticPlus: 47700
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2650,
					rare: 5300,
					epic: 10600,
					unique: 15900,
					legendary: 39750,
					mystic: 119250,
					mysticPlus: 238500
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 24,
					rare: 48,
					epic: 96,
					unique: 140,
					legendary: 360,
					mystic: 720,
					mysticPlus: 1100
				}
			}
		],
		special: { label: '주 스탯', value: 5, unit: 'percent' }
	},
	{
		chapter: 32,
		name: '도도',
		rewards: [
			{ itemId: 'journey-coin', amount: 125000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 560,
					rare: 1120,
					epic: 2240,
					unique: 3360,
					legendary: 8400,
					mystic: 25200,
					mysticPlus: 50400
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2800,
					rare: 5600,
					epic: 11200,
					unique: 16800,
					legendary: 42000,
					mystic: 126000,
					mysticPlus: 252000
				}
			},
			{
				label: '경험치 획득량',
				unit: 'percent',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 12
				}
			}
		],
		special: { label: '보스 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 33,
		name: '릴리노흐',
		rewards: [
			{ itemId: 'journey-coin', amount: 148000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 590,
					rare: 1180,
					epic: 2360,
					unique: 3540,
					legendary: 8850,
					mystic: 26550,
					mysticPlus: 53100
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 2950,
					rare: 5900,
					epic: 11800,
					unique: 17700,
					legendary: 44250,
					mystic: 132750,
					mysticPlus: 265500
				}
			},
			{
				label: '데미지',
				unit: 'percent',
				values: {
					normal: 0.8,
					rare: 1.6,
					epic: 3.2,
					unique: 4.8,
					legendary: 12,
					mystic: 24,
					mysticPlus: 36
				}
			}
		],
		special: { label: '최소 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 34,
		name: '라이카',
		rewards: [
			{ itemId: 'journey-coin', amount: 173000 },
			{ itemId: 'additional-cube', amount: 5 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 620,
					rare: 1240,
					epic: 2480,
					unique: 3720,
					legendary: 9300,
					mystic: 27900,
					mysticPlus: 55800
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3100,
					rare: 6200,
					epic: 12400,
					unique: 18600,
					legendary: 46500,
					mystic: 139500,
					mysticPlus: 279000
				}
			},
			{
				label: '메소 획득량',
				unit: 'percent',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 12
				}
			}
		],
		special: { label: '최대 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 35,
		name: '붉은 성채의 간수',
		rewards: [
			{ itemId: 'journey-coin', amount: 200000 },
			{ itemId: 'starforce-scroll', amount: 20 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 650,
					rare: 1300,
					epic: 2600,
					unique: 3900,
					legendary: 9750,
					mystic: 29250,
					mysticPlus: 58500
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3250,
					rare: 6500,
					epic: 13000,
					unique: 19500,
					legendary: 48750,
					mystic: 146250,
					mysticPlus: 292500
				}
			},
			{
				label: '최종 데미지',
				unit: 'percent',
				values: {
					normal: 0.1,
					rare: 0.2,
					epic: 0.4,
					unique: 0.6,
					legendary: 1.5,
					mystic: 3,
					mysticPlus: 4.5
				}
			}
		],
		special: { label: '크리티컬 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 36,
		name: '마스터 레드너그',
		rewards: [
			{ itemId: 'journey-coin', amount: 231000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 680,
					rare: 1360,
					epic: 2720,
					unique: 4080,
					legendary: 10200,
					mystic: 30600,
					mysticPlus: 61200
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3400,
					rare: 6800,
					epic: 13600,
					unique: 20400,
					legendary: 51000,
					mystic: 153000,
					mysticPlus: 306000
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 27,
					rare: 54,
					epic: 110,
					unique: 160,
					legendary: 410,
					mystic: 810,
					mysticPlus: 1200
				}
			}
		],
		special: { label: '보스 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 37,
		name: '락 스피릿',
		rewards: [
			{ itemId: 'journey-coin', amount: 264000 },
			{ itemId: 'additional-cube', amount: 5 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 710,
					rare: 1420,
					epic: 2840,
					unique: 4260,
					legendary: 10650,
					mystic: 31950,
					mysticPlus: 63900
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3550,
					rare: 7100,
					epic: 14200,
					unique: 21300,
					legendary: 53250,
					mystic: 159750,
					mysticPlus: 319500
				}
			},
			{
				label: '크리티컬 데미지',
				unit: 'percent',
				values: {
					normal: 0.4,
					rare: 0.8,
					epic: 1.6,
					unique: 2.4,
					legendary: 6,
					mystic: 12,
					mysticPlus: 15
				}
			}
		],
		special: { label: '일반 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 38,
		name: '각성한 락 스피릿',
		rewards: [
			{ itemId: 'journey-coin', amount: 300000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 740,
					rare: 1480,
					epic: 2960,
					unique: 4440,
					legendary: 11100,
					mystic: 33300,
					mysticPlus: 66600
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3700,
					rare: 7400,
					epic: 14800,
					unique: 22200,
					legendary: 55500,
					mystic: 166500,
					mysticPlus: 333000
				}
			},
			{
				label: '경험치 획득량',
				unit: 'percent',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 12
				}
			}
		],
		special: { label: '주 스탯', value: 5, unit: 'percent' }
	},
	{
		chapter: 39,
		name: '다크 플로라',
		rewards: [
			{ itemId: 'journey-coin', amount: 341000 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 770,
					rare: 1540,
					epic: 3080,
					unique: 4620,
					legendary: 11550,
					mystic: 34650,
					mysticPlus: 69300
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 3850,
					rare: 7700,
					epic: 15400,
					unique: 23100,
					legendary: 57750,
					mystic: 173250,
					mysticPlus: 346500
				}
			},
			{
				label: '메소 획득량',
				unit: 'percent',
				values: {
					normal: 1,
					rare: 2,
					epic: 3,
					unique: 5,
					legendary: 7,
					mystic: 10,
					mysticPlus: 12
				}
			}
		],
		special: { label: '최소 데미지 배율', value: 10, unit: 'percent' }
	},
	{
		chapter: 40,
		name: '제너럴 호넷',
		rewards: [
			{ itemId: 'journey-coin', amount: 390000 },
			{ itemId: 'additional-cube', amount: 5 },
			{ itemId: 'miracle-cube', amount: 10 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 800,
					rare: 1600,
					epic: 3200,
					unique: 4800,
					legendary: 12000,
					mystic: 36000,
					mysticPlus: 72000
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 4000,
					rare: 8000,
					epic: 16000,
					unique: 24000,
					legendary: 60000,
					mystic: 180000,
					mysticPlus: 360000
				}
			},
			{
				label: '크리티컬 데미지',
				unit: 'percent',
				values: {
					normal: 0.4,
					rare: 0.8,
					epic: 1.6,
					unique: 2.4,
					legendary: 6,
					mystic: 12,
					mysticPlus: 18
				}
			}
		],
		special: { label: '최종 데미지', value: 2.5, unit: 'percent' }
	},
	{
		chapter: 41,
		name: '타란튤로스',
		rewards: [
			{ itemId: 'journey-coin', amount: 446000 },
			{ itemId: 'starforce-scroll', amount: 20 }
		],
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 830,
					rare: 1660,
					epic: 3320,
					unique: 4980,
					legendary: 12450,
					mystic: 37350,
					mysticPlus: 74700
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 4150,
					rare: 8300,
					epic: 16600,
					unique: 24900,
					legendary: 62250,
					mystic: 186750,
					mysticPlus: 373500
				}
			},
			{
				label: '주 스탯',
				unit: 'flat',
				values: {
					normal: 29,
					rare: 58,
					epic: 120,
					unique: 170,
					legendary: 440,
					mystic: 870,
					mysticPlus: 1300
				}
			}
		],
		special: { label: '보스 몬스터 데미지', value: 10, unit: 'percent' }
	},
	{
		chapter: 42,
		name: '흉터곰',
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 860,
					rare: 1720,
					epic: 3440,
					unique: 5160,
					legendary: 12900,
					mystic: 38700,
					mysticPlus: 77400
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 4300,
					rare: 8600,
					epic: 17200,
					unique: 25800,
					legendary: 64500,
					mystic: 193500,
					mysticPlus: 387000
				}
			}
		]
	},
	{
		chapter: 43,
		name: '도둑 까마귀',
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 890,
					rare: 1780,
					epic: 3560,
					unique: 5340,
					legendary: 13350,
					mystic: 40050,
					mysticPlus: 80100
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 4450,
					rare: 8900,
					epic: 17800,
					unique: 26700,
					legendary: 66750,
					mystic: 200250,
					mysticPlus: 400500
				}
			}
		]
	},
	{
		chapter: 44,
		name: '게오르크',
		slots: [
			{
				label: '공격력',
				unit: 'flat',
				values: {
					normal: 920,
					rare: 1840,
					epic: 3680,
					unique: 5520,
					legendary: 13800,
					mystic: 41400,
					mysticPlus: 82800
				}
			},
			{
				label: '최대 HP',
				unit: 'flat',
				values: {
					normal: 4600,
					rare: 9200,
					epic: 18400,
					unique: 27600,
					legendary: 69000,
					mystic: 207000,
					mysticPlus: 414000
				}
			}
		]
	}
]

/** 표 기본 선택 챕터 */
const STAGE_JOURNEY_DEFAULT_CHAPTER = STAGE_JOURNEY_CHAPTERS[0]?.chapter ?? 20

function getStageJourneyChapter(chapter: number) {
	return STAGE_JOURNEY_CHAPTERS.find((entry) => entry.chapter === chapter)
}

/** 보유 효과·특수 옵션 수치 표시 */
function formatStageJourneyStatValue(value: number, unit: 'flat' | 'percent') {
	if (unit === 'percent') {
		return `${value}%`
	}
	return formatLocaleNumber(value)
}

export {
	formatStageJourneyStatValue,
	getStageJourneyChapter,
	getStageJourneyPortraitSrc,
	STAGE_JOURNEY_CHAPTERS,
	STAGE_JOURNEY_DEFAULT_CHAPTER,
	STAGE_JOURNEY_GRADE_META,
	STAGE_JOURNEY_GRADE_ORDER
}
