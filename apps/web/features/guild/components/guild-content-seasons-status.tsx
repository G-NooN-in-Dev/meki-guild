import { connection } from 'next/server'

import SeasonStatusItem from '@/features/guild/components/guild-content-seasons-status-item'
import { getGuildContentSeasonSummaries } from '@/libs/guild-content-seasons.constants'

/**
 * 대항전·수련장·길드보스 현재 시즌 상태 요약.
 * 시즌 상태는 현재 시각 기준이라, connection으로 요청 시점에 렌더합니다.
 * (정적 빌드 시각에 dayjs()가 고정되면 종료 후에도 '진행'으로 남습니다.)
 */
async function GuildContentSeasonsStatus() {
	await connection()
	const summaries = getGuildContentSeasonSummaries()

	return (
		<div className="grid gap-3 md:grid-cols-3">
			{summaries.map((summary) => (
				<SeasonStatusItem key={summary.content} summary={summary} />
			))}
		</div>
	)
}

export default GuildContentSeasonsStatus
