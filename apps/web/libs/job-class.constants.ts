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
 * 계열별 직업 목록 (SSOT).
 * 인원 0인 직업도 분포표에 포함합니다.
 * 스프레드시트 직업 분포(계열/직업/인원수)와 동일한 분류 기준을 따릅니다.
 */
const JOBS_BY_CLASS_LINE_MAP = {
	전사: ['다크나이트', '히어로', '팔라딘', '소울마스터'],
	마법사: ['불독', '썬콜', '비숍', '플레임위자드'],
	궁수: ['보우마스터', '신궁', '윈드브레이커'],
	도적: ['나이트로드', '섀도어', '나이트워커'],
	해적: ['바이퍼', '캡틴']
} as const satisfies Record<JobClassLine, readonly string[]>

type KnownJob = (typeof JOBS_BY_CLASS_LINE_MAP)[JobClassLine][number]

/** 호출부 `includes(string)` 등과 호환되도록 넓힌 공개 뷰 */
export const JOBS_BY_CLASS_LINE: Record<JobClassLine, readonly string[]> = JOBS_BY_CLASS_LINE_MAP

/** 4차 전직 직업명 → 계열 매핑. JOBS_BY_CLASS_LINE_MAP에서 파생합니다. */
const JOB_TO_CLASS_LINE = Object.fromEntries(
	JOB_CLASS_LINE_ORDER.flatMap((classLine) => JOBS_BY_CLASS_LINE_MAP[classLine].map((job) => [job, classLine] as const))
) as Record<KnownJob, JobClassLine>

/**
 * 긴 공식 직업명 → UI/집계용 짧은 직업명.
 * 길드 시트·필터는 썬콜/불독을 씁니다.
 */
const JOB_NAME_ALIASES = {
	'아크메이지(불,독)': '불독',
	'아크메이지(썬,콜)': '썬콜'
} as const satisfies Record<string, KnownJob>

/** 색상·계열 조회용 canonical 직업키로 맞춥니다. */
function resolveJobKey(job: string): string {
	return JOB_NAME_ALIASES[job as keyof typeof JOB_NAME_ALIASES] ?? job
}

/** resolveJobKey 후 테이블 조회. 없으면 fallback. */
function lookupByJobKey<V, F>(job: string, table: Readonly<Partial<Record<string, V>>>, fallback: F): V | F {
	const jobKey = resolveJobKey(job)
	return (table[jobKey] as V | undefined) ?? fallback
}

function getJobClassLine(job: string): JobClassLine | null {
	return lookupByJobKey(job, JOB_TO_CLASS_LINE, null)
}

/**
 * 계열 색의 단일 기준 (@theme pastel).
 * 배지·차트·카드가 같은 톤을 쓰고, 역할마다 단계만 나눕니다.
 * 라이트 배지는 100 배경·800 글자입니다.
 * 다크 배지는 950 배경에 차트 면(200) 글자입니다. 선(700) 배경 위 면 색은 10px에서 묻힙니다.
 */
const JOB_CLASS_LINE_COLOR = {
	전사: {
		badgeClass:
			'border-transparent bg-pastel-orange-100 text-pastel-orange-800 dark:bg-pastel-orange-950 dark:text-pastel-orange-200',
		chartStroke: 'var(--color-pastel-orange-700)',
		chartFill: 'var(--color-pastel-orange-200)',
		cardBgClass: 'bg-pastel-orange-100 dark:bg-pastel-orange-900'
	},
	마법사: {
		badgeClass:
			'border-transparent bg-pastel-blue-100 text-pastel-blue-800 dark:bg-pastel-blue-950 dark:text-pastel-blue-200',
		chartStroke: 'var(--color-pastel-blue-700)',
		chartFill: 'var(--color-pastel-blue-200)',
		cardBgClass: 'bg-pastel-blue-100 dark:bg-pastel-blue-900'
	},
	궁수: {
		badgeClass:
			'border-transparent bg-pastel-green-100 text-pastel-green-800 dark:bg-pastel-green-950 dark:text-pastel-green-200',
		chartStroke: 'var(--color-pastel-green-700)',
		chartFill: 'var(--color-pastel-green-200)',
		cardBgClass: 'bg-pastel-green-100 dark:bg-pastel-green-900'
	},
	도적: {
		badgeClass:
			'border-transparent bg-pastel-purple-100 text-pastel-purple-800 dark:bg-pastel-purple-950 dark:text-pastel-purple-200',
		chartStroke: 'var(--color-pastel-purple-700)',
		chartFill: 'var(--color-pastel-purple-200)',
		cardBgClass: 'bg-pastel-purple-100 dark:bg-pastel-purple-900'
	},
	해적: {
		badgeClass:
			'border-transparent bg-pastel-red-100 text-pastel-red-800 dark:bg-pastel-red-950 dark:text-pastel-red-200',
		chartStroke: 'var(--color-pastel-red-700)',
		chartFill: 'var(--color-pastel-red-200)',
		cardBgClass: 'bg-pastel-red-100 dark:bg-pastel-red-900'
	}
} as const satisfies Record<
	JobClassLine,
	{ badgeClass: string; chartStroke: string; chartFill: string; cardBgClass: string }
>

const UNCLASSIFIED_BADGE_CLASS = 'border-transparent bg-grayscale-100 text-grayscale-600'

function getJobClassLineColor(classLine: JobClassLine): (typeof JOB_CLASS_LINE_COLOR)[JobClassLine] {
	return JOB_CLASS_LINE_COLOR[classLine]
}

function getJobClassLineBadgeClass(classLine: JobClassLine | '미분류'): string {
	if (classLine === '미분류') return UNCLASSIFIED_BADGE_CLASS
	return JOB_CLASS_LINE_COLOR[classLine].badgeClass
}

/**
 * 직업 색의 단일 기준 (@theme pastel·grayscale).
 * 라이트 배지 배경은 차트 fill, 글자는 950입니다.
 * 다크 배지 배경은 950, 글자는 차트 fill입니다. 선 배경 위에서는 면 색 글자가 묻힙니다.
 * 다크나이트만 grayscale이라 토큰이 뒤집혀 차트 선·면과 이미 맞으므로 dark:를 두지 않습니다.
 * 같은 직업군 안에서는 fill·stroke 단계로 구분합니다.
 */
const JOB_COLOR = {
	히어로: {
		badgeClass:
			'border-transparent bg-pastel-orange-200 text-pastel-orange-950 dark:bg-pastel-orange-950 dark:text-pastel-orange-200',
		chartStroke: 'var(--color-pastel-orange-700)',
		chartFill: 'var(--color-pastel-orange-200)'
	},
	다크나이트: {
		badgeClass: 'border-transparent bg-grayscale-200 text-grayscale-700',
		chartStroke: 'var(--color-grayscale-700)',
		chartFill: 'var(--color-grayscale-200)'
	},
	팔라딘: {
		badgeClass:
			'border-transparent bg-pastel-yellow-200 text-pastel-yellow-950 dark:bg-pastel-yellow-950 dark:text-pastel-yellow-200',
		chartStroke: 'var(--color-pastel-yellow-700)',
		chartFill: 'var(--color-pastel-yellow-200)'
	},
	소울마스터: {
		badgeClass:
			'border-transparent bg-pastel-yellow-300 text-pastel-yellow-950 dark:bg-pastel-yellow-950 dark:text-pastel-yellow-300',
		chartStroke: 'var(--color-pastel-yellow-800)',
		chartFill: 'var(--color-pastel-yellow-300)'
	},
	불독: {
		badgeClass:
			'border-transparent bg-pastel-red-200 text-pastel-red-950 dark:bg-pastel-red-950 dark:text-pastel-red-200',
		chartStroke: 'var(--color-pastel-red-700)',
		chartFill: 'var(--color-pastel-red-200)'
	},
	썬콜: {
		badgeClass:
			'border-transparent bg-pastel-blue-200 text-pastel-blue-950 dark:bg-pastel-blue-950 dark:text-pastel-blue-200',
		chartStroke: 'var(--color-pastel-blue-700)',
		chartFill: 'var(--color-pastel-blue-200)'
	},
	비숍: {
		badgeClass:
			'border-transparent bg-pastel-yellow-200 text-pastel-yellow-950 dark:bg-pastel-yellow-950 dark:text-pastel-yellow-200',
		chartStroke: 'var(--color-pastel-yellow-700)',
		chartFill: 'var(--color-pastel-yellow-200)'
	},
	플레임위자드: {
		badgeClass:
			'border-transparent bg-pastel-red-100 text-pastel-red-950 dark:bg-pastel-red-950 dark:text-pastel-red-100',
		chartStroke: 'var(--color-pastel-red-600)',
		chartFill: 'var(--color-pastel-red-100)'
	},
	보우마스터: {
		badgeClass:
			'border-transparent bg-pastel-green-200 text-pastel-green-950 dark:bg-pastel-green-950 dark:text-pastel-green-200',
		chartStroke: 'var(--color-pastel-green-700)',
		chartFill: 'var(--color-pastel-green-200)'
	},
	신궁: {
		badgeClass:
			'border-transparent bg-pastel-green-300 text-pastel-green-950 dark:bg-pastel-green-950 dark:text-pastel-green-300',
		chartStroke: 'var(--color-pastel-green-800)',
		chartFill: 'var(--color-pastel-green-300)'
	},
	윈드브레이커: {
		badgeClass:
			'border-transparent bg-pastel-green-100 text-pastel-green-950 dark:bg-pastel-green-950 dark:text-pastel-green-100',
		chartStroke: 'var(--color-pastel-green-600)',
		chartFill: 'var(--color-pastel-green-100)'
	},
	나이트로드: {
		badgeClass:
			'border-transparent bg-pastel-navy-200 text-pastel-navy-950 dark:bg-pastel-navy-950 dark:text-pastel-navy-200',
		chartStroke: 'var(--color-pastel-navy-700)',
		chartFill: 'var(--color-pastel-navy-200)'
	},
	섀도어: {
		badgeClass:
			'border-transparent bg-pastel-purple-200 text-pastel-purple-950 dark:bg-pastel-purple-950 dark:text-pastel-purple-200',
		chartStroke: 'var(--color-pastel-purple-700)',
		chartFill: 'var(--color-pastel-purple-200)'
	},
	나이트워커: {
		badgeClass:
			'border-transparent bg-pastel-purple-300 text-pastel-purple-950 dark:bg-pastel-purple-950 dark:text-pastel-purple-300',
		chartStroke: 'var(--color-pastel-purple-800)',
		chartFill: 'var(--color-pastel-purple-300)'
	},
	바이퍼: {
		badgeClass:
			'border-transparent bg-pastel-red-200 text-pastel-red-950 dark:bg-pastel-red-950 dark:text-pastel-red-200',
		chartStroke: 'var(--color-pastel-red-700)',
		chartFill: 'var(--color-pastel-red-200)'
	},
	캡틴: {
		badgeClass:
			'border-transparent bg-pastel-navy-200 text-pastel-navy-950 dark:bg-pastel-navy-950 dark:text-pastel-navy-200',
		chartStroke: 'var(--color-pastel-navy-700)',
		chartFill: 'var(--color-pastel-navy-200)'
	}
} as const satisfies Record<KnownJob, { badgeClass: string; chartStroke: string; chartFill: string }>

const FALLBACK_JOB_BADGE_CLASS = 'border-transparent bg-grayscale-100 text-grayscale-600'

function getJobColor(job: string): (typeof JOB_COLOR)[KnownJob] | null {
	return lookupByJobKey(job, JOB_COLOR, null)
}

function getJobBadgeClass(job: string): string {
	return getJobColor(job)?.badgeClass ?? FALLBACK_JOB_BADGE_CLASS
}

export {
	getJobBadgeClass,
	getJobClassLine,
	getJobClassLineBadgeClass,
	getJobClassLineColor,
	getJobColor,
	resolveJobKey
}
export type { JobClassLine }
