/**
 * 등급 표기.
 * 기본은 노말→미스틱이고, + 는 일부 컨텐츠만, 에인션트·이터니티는 무기만 씁니다.
 */

/** 공통 기본 등급. 낮은 등급부터입니다. */
const GRADES = ['normal', 'rare', 'epic', 'unique', 'legendary', 'mystic'] as const

/** 일부 컨텐츠만 쓰는 + 등급 */
const GRADE_PLUSES = ['legendaryPlus', 'mysticPlus'] as const

/** 무기만 쓰는 상위 등급. 높은 등급부터입니다. */
const WEAPON_ONLY_GRADES = ['eternity', 'ancient'] as const

type Grade = (typeof GRADES)[number]
type GradePlus = (typeof GRADE_PLUSES)[number]
type WeaponOnlyGrade = (typeof WEAPON_ONLY_GRADES)[number]
type GradeKey = Grade | GradePlus | WeaponOnlyGrade

/** 등급 한글 라벨 */
const GRADE_LABEL = {
	normal: '노말',
	rare: '레어',
	epic: '에픽',
	unique: '유니크',
	legendary: '레전더리',
	legendaryPlus: '레전더리+',
	mystic: '미스틱',
	mysticPlus: '미스틱+',
	ancient: '에인션트',
	eternity: '이터니티'
} as const satisfies Record<GradeKey, string>

export { GRADE_LABEL, GRADE_PLUSES, GRADES, WEAPON_ONLY_GRADES }
export type { Grade, GradeKey, GradePlus, WeaponOnlyGrade }
