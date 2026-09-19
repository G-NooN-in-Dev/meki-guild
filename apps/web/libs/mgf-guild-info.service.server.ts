const MGF_ORIGIN = 'https://mgf.gg'
const MGF_GUILD_INFO_PATH = '/contents/guild_info.php'
const MGF_FETCH_TIMEOUT_MS = 15_000

/**
 * mgf.gg 길드 정보 HTML을 가져옵니다.
 * CORS를 피하기 위해 서버에서만 호출합니다.
 */
async function getMgfGuildInfoHtml(guildName: string): Promise<string> {
	const url = new URL(MGF_GUILD_INFO_PATH, MGF_ORIGIN)
	url.searchParams.set('g_name', guildName)

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), MGF_FETCH_TIMEOUT_MS)

	try {
		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				Accept: 'text/html,application/xhtml+xml',
				'User-Agent': 'meki-guild/1.0 (+https://github.com; guild rivalry predict)'
			},
			// mgf는 실시간 데이터라 캐시하지 않습니다.
			cache: 'no-store'
		})

		if (!response.ok) {
			throw new Error(`mgf.gg 응답 오류 (${response.status})`)
		}

		return await response.text()
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('길드 정보 조회 시간이 초과되었습니다.')
		}

		throw error
	} finally {
		clearTimeout(timeoutId)
	}
}

export { getMgfGuildInfoHtml, MGF_ORIGIN }
