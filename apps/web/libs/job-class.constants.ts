/** 메이플스토리 직업 계열 */
export type JobClassLine = '전사' | '마법사' | '궁수' | '도적' | '해적'

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
	바이퍼: '해적',
	캡틴: '해적'
} as const satisfies Record<string, JobClassLine>

/** 계열별 직업 목록. 인원 0인 직업도 분포표에 포함합니다. */
export const JOBS_BY_CLASS_LINE: Record<JobClassLine, readonly string[]> = {
	전사: ['다크나이트', '히어로', '팔라딘'],
	마법사: ['불독', '썬콜', '비숍'],
	궁수: ['보우마스터', '신궁'],
	도적: ['나이트로드', '섀도어'],
	해적: ['바이퍼', '캡틴']
}

export function getJobClassLine(job: string): JobClassLine | null {
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

export function getJobClassLineBadgeClass(classLine: JobClassLine | '미분류'): string {
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
	나이트로드: 'text-pastel-blue-800',
	섀도어: 'text-pastel-purple-700',
	바이퍼: 'text-pastel-red-800',
	캡틴: 'text-grayscale-700'
} as const satisfies Record<keyof typeof JOB_TO_CLASS_LINE, string>

const FALLBACK_JOB_TEXT_CLASS = 'text-grayscale-700'

export function getJobTextClass(job: string): string {
	return JOB_TEXT_CLASS[job as keyof typeof JOB_TEXT_CLASS] ?? FALLBACK_JOB_TEXT_CLASS
}
