import { getJobClassLineColor, getJobColor, type JobClassLine } from '@/libs/job-class.constants'

const FALLBACK_JOB_CHART_STROKE = 'var(--color-grayscale-600)'
const FALLBACK_JOB_CHART_FILL = 'var(--color-grayscale-200)'

/** 직업·계열 색은 job-class.constants의 단일 기준을 그대로 씁니다. */
function getJobClassLineChartStroke(classLine: JobClassLine): string {
	return getJobClassLineColor(classLine).chartStroke
}

function getJobClassLineChartFill(classLine: JobClassLine): string {
	return getJobClassLineColor(classLine).chartFill
}

function getJobClassLineCardBgClass(classLine: JobClassLine): string {
	return getJobClassLineColor(classLine).cardBgClass
}

function getJobChartStroke(job: string): string {
	return getJobColor(job)?.chartStroke ?? FALLBACK_JOB_CHART_STROKE
}

function getJobChartFill(job: string): string {
	return getJobColor(job)?.chartFill ?? FALLBACK_JOB_CHART_FILL
}

export {
	getJobChartFill,
	getJobChartStroke,
	getJobClassLineCardBgClass,
	getJobClassLineChartFill,
	getJobClassLineChartStroke
}
