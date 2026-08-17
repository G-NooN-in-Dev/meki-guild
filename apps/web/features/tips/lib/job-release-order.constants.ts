import type { JobReleaseEntry, JobReleaseTableRow } from '@/features/tips/types/job-release-order.type'
import { getJobClassLine } from '@/libs/job-class.constants'

/**
 * 원작 메이플스토리 직업 출시 순서.
 * 날짜는 원작 업데이트 기준이며, 메이플키우기 실제 출시일과는 다를 수 있습니다.
 * 같은 날짜는 전직 계열(전사→해적) 순으로 나열합니다.
 */
export const JOB_RELEASE_ENTRIES = [
	{ releasedAt: '2003-04-29', classLines: ['전사'], job: '히어로' },
	{ releasedAt: '2003-04-29', classLines: ['전사'], job: '팔라딘' },
	{ releasedAt: '2003-04-29', classLines: ['전사'], job: '다크나이트' },
	{ releasedAt: '2003-04-29', classLines: ['마법사'], job: '불독', label: '아크메이지(불,독)' },
	{ releasedAt: '2003-04-29', classLines: ['마법사'], job: '썬콜', label: '아크메이지(썬,콜)' },
	{ releasedAt: '2003-04-29', classLines: ['마법사'], job: '비숍' },
	{ releasedAt: '2003-04-29', classLines: ['궁수'], job: '보우마스터' },
	{ releasedAt: '2003-04-29', classLines: ['궁수'], job: '신궁' },
	{ releasedAt: '2003-04-29', classLines: ['도적'], job: '나이트로드' },
	{ releasedAt: '2003-04-29', classLines: ['도적'], job: '섀도어' },
	{ releasedAt: '2007-12-18', classLines: ['해적'], job: '바이퍼' },
	{ releasedAt: '2007-12-18', classLines: ['해적'], job: '캡틴' },
	{ releasedAt: '2008-12-18', classLines: ['전사'], job: '소울마스터' },
	{ releasedAt: '2008-12-18', classLines: ['마법사'], job: '플레임위자드' },
	{ releasedAt: '2008-12-18', classLines: ['궁수'], job: '윈드브레이커' },
	{ releasedAt: '2008-12-18', classLines: ['도적'], job: '나이트워커' },
	{ releasedAt: '2008-12-18', classLines: ['해적'], job: '스트라이커' },
	{ releasedAt: '2009-07-09', classLines: ['전사'], job: '아란' },
	{ releasedAt: '2009-12-17', classLines: ['마법사'], job: '에반' },
	{ releasedAt: '2010-02-25', classLines: ['도적'], job: '듀얼블레이드' },
	{ releasedAt: '2010-07-22', classLines: ['마법사'], job: '배틀메이지' },
	{ releasedAt: '2010-07-22', classLines: ['궁수'], job: '와일드헌터' },
	{ releasedAt: '2010-08-12', classLines: ['해적'], job: '메카닉' },
	{ releasedAt: '2011-07-07', classLines: ['해적'], job: '캐논슈터' },
	{ releasedAt: '2011-07-21', classLines: ['궁수'], job: '메르세데스' },
	{ releasedAt: '2011-08-04', classLines: ['전사'], job: '데몬슬레이어' },
	{ releasedAt: '2011-12-29', classLines: ['도적'], job: '팬텀' },
	{ releasedAt: '2012-03-22', classLines: ['전사'], job: '미하일' },
	{ releasedAt: '2012-07-12', classLines: ['마법사'], job: '루미너스' },
	{ releasedAt: '2012-07-26', classLines: ['전사'], job: '카이저' },
	{ releasedAt: '2012-08-09', classLines: ['해적'], job: '엔젤릭버스터' },
	{ releasedAt: '2012-12-20', classLines: ['전사'], job: '데몬어벤져' },
	{ releasedAt: '2013-01-03', classLines: ['도적', '해적'], job: '제논' },
	{ releasedAt: '2013-07-18', classLines: ['전사'], job: '제로' },
	{ releasedAt: '2014-01-02', classLines: ['해적'], job: '은월' },
	{ releasedAt: '2015-07-23', classLines: ['마법사'], job: '키네시스' },
	{ releasedAt: '2015-12-22', classLines: ['전사'], job: '블래스터' },
	{ releasedAt: '2017-07-06', classLines: ['도적'], job: '카데나' },
	{ releasedAt: '2017-08-10', classLines: ['마법사'], job: '일리움' },
	{ releasedAt: '2018-01-04', classLines: ['해적'], job: '아크' },
	{ releasedAt: '2019-01-31', classLines: ['궁수'], job: '패스파인더' },
	{ releasedAt: '2019-07-18', classLines: ['도적'], job: '호영' },
	{ releasedAt: '2020-01-16', classLines: ['전사'], job: '아델' },
	{ releasedAt: '2021-01-07', classLines: ['궁수'], job: '카인' },
	{ releasedAt: '2021-07-15', classLines: ['마법사'], job: '라라' },
	{ releasedAt: '2023-01-19', classLines: ['도적'], job: '칼리' },
	{ releasedAt: '2025-06-19', classLines: ['전사'], job: '렌' },
	{ releasedAt: '2026-06-18', classLines: ['마법사'], job: '레테' }
] as const satisfies readonly JobReleaseEntry[]

/** 길드 직업 매핑에 있으면 메이플키우기에 출시된 직업으로 봅니다. */
function isMapleIdleReleasedJob(job: string) {
	return getJobClassLine(job) !== null
}

/** 표에 보여줄 직업명. 불독·썬콜은 아크메이지 표기를 씁니다. */
function getJobReleaseDisplayName({ job, label }: Pick<JobReleaseEntry, 'job' | 'label'>) {
	return label ?? job
}

/** 표 날짜 셀 표기. 같은 날짜 병합 시에도 한 줄로 맞춰 둡니다. */
function formatReleaseDateLabel(releasedAt: string) {
	const [year, month, day] = releasedAt.split('-')
	return `${year}.${month}.${day}`
}

/**
 * 같은 날짜 직업을 묶어 날짜 셀 rowSpan을 계산합니다.
 * 출시 여부는 길드 직업 상수와 맞춰, 메키에 직업이 추가되면 표도 같이 바뀝니다.
 */
function buildJobReleaseTableRows(entries: readonly JobReleaseEntry[] = JOB_RELEASE_ENTRIES): JobReleaseTableRow[] {
	const dateCounts = new Map<string, number>()

	for (const { releasedAt } of entries) {
		dateCounts.set(releasedAt, (dateCounts.get(releasedAt) ?? 0) + 1)
	}

	let previousDate: string | null = null

	return entries.map((entry) => {
		const isFirstOfDate = entry.releasedAt !== previousDate
		previousDate = entry.releasedAt

		return {
			...entry,
			isFirstOfDate,
			dateRowSpan: dateCounts.get(entry.releasedAt) ?? 1,
			isReleased: isMapleIdleReleasedJob(entry.job)
		}
	})
}

function getJobReleaseStats(entries: readonly JobReleaseEntry[] = JOB_RELEASE_ENTRIES) {
	const total = entries.length
	const releasedCount = entries.filter((entry) => isMapleIdleReleasedJob(entry.job)).length

	return {
		total,
		releasedCount,
		upcomingCount: total - releasedCount
	}
}

export const JOB_RELEASE_STATS = getJobReleaseStats()

const RELEASED_ENTRIES = JOB_RELEASE_ENTRIES.filter((entry) => isMapleIdleReleasedJob(entry.job))
const UPCOMING_ENTRIES = JOB_RELEASE_ENTRIES.filter((entry) => !isMapleIdleReleasedJob(entry.job))

/** 메키 출시·미출시 표용. 각 목록 안에서는 원작 출시일 순서를 유지합니다. */
export const JOB_RELEASED_TABLE_ROWS = buildJobReleaseTableRows(RELEASED_ENTRIES)
export const JOB_UPCOMING_TABLE_ROWS = buildJobReleaseTableRows(UPCOMING_ENTRIES)

export {
	buildJobReleaseTableRows,
	formatReleaseDateLabel,
	getJobReleaseDisplayName,
	getJobReleaseStats,
	isMapleIdleReleasedJob
}
