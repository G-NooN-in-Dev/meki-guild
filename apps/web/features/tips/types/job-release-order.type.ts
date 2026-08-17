import type { JobClassLine } from '@/libs/job-class.constants'

/** 원작 메이플스토리 직업 1개의 출시 정보 */
type JobReleaseEntry = {
	/** 원작 업데이트 일자 (YYYY-MM-DD) */
	releasedAt: string
	/** 전직 계열. 제논만 도적·해적 둘 다 */
	classLines: readonly JobClassLine[]
	/** 길드·메키 직업 매칭용 이름 (불독·썬콜 등) */
	job: string
	/** 표에 보여줄 이름. 없으면 job을 그대로 씁니다 */
	label?: string
}

/** 같은 날짜 행을 병합해 표에 그릴 때 쓰는 한 줄 */
type JobReleaseTableRow = JobReleaseEntry & {
	/** 해당 날짜 그룹의 첫 행이면 날짜 셀을 그립니다 */
	isFirstOfDate: boolean
	/** 같은 날짜 직업 수 — 날짜 셀 rowSpan */
	dateRowSpan: number
	/** 메이플키우기에 이미 나온 직업인지 */
	isReleased: boolean
}

export type { JobReleaseEntry, JobReleaseTableRow }
