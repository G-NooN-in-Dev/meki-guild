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
	/** 메이플키우기 출시일 (YYYY-MM-DD). 미출시면 null */
	mekiReleasedAt: string | null
	/** 연속된 같은 원작 출시일 그룹의 첫 행이면 원작 날짜 셀을 그립니다 */
	isFirstOfOriginalDate: boolean
	/** 연속된 같은 원작 출시일 직업 수 — 원작 날짜 셀 rowSpan */
	originalDateRowSpan: number
	/** 연속된 같은 메키 출시일 그룹의 첫 행이면 메키 날짜 셀을 그립니다. 미출시(null)는 행마다 표시 */
	isFirstOfMekiDate: boolean
	/** 연속된 같은 메키 출시일 직업 수 — 메키 날짜 셀 rowSpan */
	mekiDateRowSpan: number
	/** 메이플키우기에 이미 나온 직업인지 */
	isReleased: boolean
}

export type { JobReleaseEntry, JobReleaseTableRow }
