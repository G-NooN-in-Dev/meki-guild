import { connection } from 'next/server'

import HomeSeasonsPanel from '@/features/home/components/home-seasons-panel'
import { getGuildContentSeasonSummaries } from '@/libs/guild-content-seasons.constants'

/**
 * 홈(/) 시즌 상태 섹션.
 * 요청 시점 기준으로 요약을 계산한 뒤, 클릭 가능한 패널에 넘깁니다.
 */
async function HomeSeasonsSection() {
	await connection()
	const summaries = getGuildContentSeasonSummaries()

	return <HomeSeasonsPanel summaries={summaries} />
}

export default HomeSeasonsSection
