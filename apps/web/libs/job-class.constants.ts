/** 메이플스토리 직업 계열 */
type JobClassLine = '전사' | '마법사' | '궁수' | '도적' | '해적'

/** UI·집계 시 계열 표시 순서 */
export const JOB_CLASS_LINE_ORDER = [
	'전사',
	'마법사',
	'궁수',
	'도적',
	'해적'
] as const satisfies readonly JobClassLine[]

/**
 * 4차 전직 직업명 → 계열 매핑.
 * 스프레드시트 직업 분포(계열/직업/인원수)와 동일한 분류 기준을 따릅니다.
 */
export const JOB_TO_CLASS_LINE = {
	다크나이트: '전사',
	히어로: '전사',
	팔라딘: '전사',
	불독: '마법사',
	썬콜: '마법사',
	비숍: '마법사',
	보우마스터: '궁수',
	신궁: '궁수',
	나이트로드: '도적',
	섀도어: '도적',
	나이트워커: '도적',
	바이퍼: '해적',
	캡틴: '해적',
	윈드브레이커: '궁수'
} as const satisfies Record<string, JobClassLine>

/** 계열별 직업 목록. 인원 0인 직업도 분포표에 포함합니다. */
export const JOBS_BY_CLASS_LINE: Record<JobClassLine, readonly string[]> = {
	전사: ['다크나이트', '히어로', '팔라딘'],
	마법사: ['불독', '썬콜', '비숍'],
	궁수: ['보우마스터', '신궁', '윈드브레이커'],
	도적: ['나이트로드', '섀도어', '나이트워커'],
	해적: ['바이퍼', '캡틴']
}

function getJobClassLine(job: string): JobClassLine | null {
	return JOB_TO_CLASS_LINE[job as keyof typeof JOB_TO_CLASS_LINE] ?? null
}

/**
 * 직업 분포 UI용 계열 Badge 클래스.
 * 셀 전체를 칠하지 않고, 디자인 토큰 pastel-* 로 은은하게 구분합니다.
 */
export const JOB_CLASS_LINE_BADGE_CLASS = {
	전사: 'border-transparent bg-pastel-orange-100 text-pastel-orange-800',
	마법사: 'border-transparent bg-pastel-blue-100 text-pastel-blue-800',
	궁수: 'border-transparent bg-pastel-green-100 text-pastel-green-800',
	도적: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800',
	해적: 'border-transparent bg-pastel-red-100 text-pastel-red-800',
	미분류: 'border-transparent bg-grayscale-100 text-grayscale-600'
} as const satisfies Record<JobClassLine | '미분류', string>

function getJobClassLineBadgeClass(classLine: JobClassLine | '미분류'): string {
	return JOB_CLASS_LINE_BADGE_CLASS[classLine]
}

/**
 * 직업명 text 색.
 * 스프레드시트 배경색 톤을 따르되, 밝은 테이블에서도 읽히도록 700~800 계열로 맞춥니다.
 */
export const JOB_TEXT_CLASS = {
	다크나이트: 'text-grayscale-600',
	팔라딘: 'text-pastel-yellow-800',
	히어로: 'text-pastel-orange-700',
	불독: 'text-pastel-red-700',
	비숍: 'text-pastel-yellow-700',
	썬콜: 'text-pastel-blue-700',
	보우마스터: 'text-pastel-green-700',
	신궁: 'text-pastel-green-800',
	윈드브레이커: 'text-pastel-green-700',
	나이트로드: 'text-pastel-blue-800',
	섀도어: 'text-pastel-purple-700',
	나이트워커: 'text-pastel-purple-700',
	바이퍼: 'text-pastel-red-800',
	캡틴: 'text-grayscale-700'
} as const satisfies Record<keyof typeof JOB_TO_CLASS_LINE, string>

const FALLBACK_JOB_TEXT_CLASS = 'text-grayscale-700'

function getJobTextClass(job: string): string {
	return JOB_TEXT_CLASS[job as keyof typeof JOB_TEXT_CLASS] ?? FALLBACK_JOB_TEXT_CLASS
}

/**
 * 직업명 Badge 클래스.
 * JOB_TEXT_CLASS 톤과 맞추되, 배경(100) + 글자색으로 테이블·상세에서 한눈에 구분합니다.
 */
export const JOB_BADGE_CLASS = {
	다크나이트: 'border-transparent bg-grayscale-100 text-grayscale-700',
	팔라딘: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800',
	히어로: 'border-transparent bg-pastel-orange-100 text-pastel-orange-700',
	불독: 'border-transparent bg-pastel-red-100 text-pastel-red-700',
	비숍: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-700',
	썬콜: 'border-transparent bg-pastel-blue-100 text-pastel-blue-700',
	보우마스터: 'border-transparent bg-pastel-green-100 text-pastel-green-700',
	신궁: 'border-transparent bg-pastel-green-100 text-pastel-green-800',
	윈드브레이커: 'border-transparent bg-pastel-green-100 text-pastel-green-700',
	나이트로드: 'border-transparent bg-pastel-blue-100 text-pastel-blue-800',
	섀도어: 'border-transparent bg-pastel-purple-100 text-pastel-purple-700',
	나이트워커: 'border-transparent bg-pastel-purple-100 text-pastel-purple-700',
	바이퍼: 'border-transparent bg-pastel-red-100 text-pastel-red-800',
	캡틴: 'border-transparent bg-grayscale-100 text-grayscale-700'
} as const satisfies Record<keyof typeof JOB_TO_CLASS_LINE, string>

const FALLBACK_JOB_BADGE_CLASS = 'border-transparent bg-grayscale-100 text-grayscale-600'

function getJobBadgeClass(job: string): string {
	return JOB_BADGE_CLASS[job as keyof typeof JOB_BADGE_CLASS] ?? FALLBACK_JOB_BADGE_CLASS
}

export { getJobBadgeClass, getJobClassLine, getJobClassLineBadgeClass, getJobTextClass }
export type { JobClassLine }
