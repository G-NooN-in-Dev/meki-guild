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
