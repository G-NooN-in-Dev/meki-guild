import { type JobClassLine, resolveJobKey } from '@/libs/job-class.constants'

/** 직업군 차트 라인 색 */
const JOB_CLASS_LINE_CHART_STROKE = {
	전사: 'var(--color-pastel-orange-700)',
	마법사: 'var(--color-pastel-blue-700)',
	궁수: 'var(--color-pastel-green-700)',
	도적: 'var(--color-pastel-purple-700)',
	해적: 'var(--color-pastel-red-700)'
} as const satisfies Record<JobClassLine, string>

const JOB_CLASS_LINE_CHART_FILL = {
	전사: 'var(--color-pastel-orange-200)',
	마법사: 'var(--color-pastel-blue-200)',
	궁수: 'var(--color-pastel-green-200)',
	도적: 'var(--color-pastel-purple-200)',
	해적: 'var(--color-pastel-red-200)'
} as const satisfies Record<JobClassLine, string>

/** 직업군 Card 배경 */
const JOB_CLASS_LINE_CARD_BG_CLASS = {
	전사: 'bg-pastel-orange-100',
	마법사: 'bg-pastel-blue-100',
	궁수: 'bg-pastel-green-100',
	도적: 'bg-pastel-purple-100',
	해적: 'bg-pastel-red-100'
} as const satisfies Record<JobClassLine, string>

/**
 * 직업별 차트 라인 색 (@theme pastel·grayscale만 사용).
 * 같은 직업군 안에서도 구분이 되게 톤을 나눕니다.
 */
const JOB_CHART_STROKE = {
	히어로: 'var(--color-pastel-orange-700)',
	다크나이트: 'var(--color-grayscale-700)',
	팔라딘: 'var(--color-pastel-yellow-700)',
	소울마스터: 'var(--color-pastel-yellow-800)',
	불독: 'var(--color-pastel-red-700)',
	썬콜: 'var(--color-pastel-blue-700)',
	비숍: 'var(--color-pastel-yellow-700)',
	플레임위자드: 'var(--color-pastel-red-600)',
	보우마스터: 'var(--color-pastel-green-700)',
	신궁: 'var(--color-pastel-green-800)',
	윈드브레이커: 'var(--color-pastel-green-600)',
	나이트로드: 'var(--color-pastel-navy-700)',
	섀도어: 'var(--color-pastel-purple-700)',
	나이트워커: 'var(--color-pastel-purple-800)',
	바이퍼: 'var(--color-pastel-red-700)',
	캡틴: 'var(--color-pastel-navy-700)'
} as const satisfies Record<string, string>

const JOB_CHART_FILL = {
	히어로: 'var(--color-pastel-orange-200)',
	다크나이트: 'var(--color-grayscale-200)',
	팔라딘: 'var(--color-pastel-yellow-200)',
	소울마스터: 'var(--color-pastel-yellow-300)',
	불독: 'var(--color-pastel-red-200)',
	썬콜: 'var(--color-pastel-blue-200)',
	비숍: 'var(--color-pastel-yellow-200)',
	플레임위자드: 'var(--color-pastel-red-100)',
	보우마스터: 'var(--color-pastel-green-200)',
	신궁: 'var(--color-pastel-green-300)',
	윈드브레이커: 'var(--color-pastel-green-100)',
	나이트로드: 'var(--color-pastel-navy-200)',
	섀도어: 'var(--color-pastel-purple-200)',
	나이트워커: 'var(--color-pastel-purple-300)',
	바이퍼: 'var(--color-pastel-red-200)',
	캡틴: 'var(--color-pastel-navy-200)'
} as const satisfies Record<string, string>

const FALLBACK_JOB_CHART_STROKE = 'var(--color-grayscale-600)'
const FALLBACK_JOB_CHART_FILL = 'var(--color-grayscale-200)'

function getJobClassLineChartStroke(classLine: JobClassLine): string {
	return JOB_CLASS_LINE_CHART_STROKE[classLine]
}

function getJobClassLineChartFill(classLine: JobClassLine): string {
	return JOB_CLASS_LINE_CHART_FILL[classLine]
}

function getJobClassLineCardBgClass(classLine: JobClassLine): string {
	return JOB_CLASS_LINE_CARD_BG_CLASS[classLine]
}

function getJobChartStroke(job: string): string {
	const jobKey = resolveJobKey(job)
	if (jobKey in JOB_CHART_STROKE) {
		return JOB_CHART_STROKE[jobKey as keyof typeof JOB_CHART_STROKE]
	}
	return FALLBACK_JOB_CHART_STROKE
}

function getJobChartFill(job: string): string {
	const jobKey = resolveJobKey(job)
	if (jobKey in JOB_CHART_FILL) {
		return JOB_CHART_FILL[jobKey as keyof typeof JOB_CHART_FILL]
	}
	return FALLBACK_JOB_CHART_FILL
}

export {
	getJobChartFill,
	getJobChartStroke,
	getJobClassLineCardBgClass,
	getJobClassLineChartFill,
	getJobClassLineChartStroke
}
