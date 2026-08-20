import type { ChangelogEntry } from '@/features/updates/types/changelog.type'

/**
 * 사이트 업데이트 일지.
 * 새 버전은 배열 **앞쪽**에 추가합니다. (최신이 위로)
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = []

/** YYYY-MM-DD → 화면 표기(2026.08.19) */
function formatChangelogDate(date: string): string {
	const [year, month, day] = date.split('-')

	return `${year}.${month}.${day}`
}

export { formatChangelogDate }
