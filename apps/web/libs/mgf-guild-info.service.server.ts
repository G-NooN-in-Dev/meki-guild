import { fetchMgfText, MGF_ORIGIN } from './mgf.client.server'

const MGF_GUILD_INFO_PATH = '/contents/guild_info.php'

/**
 * mgf.gg 길드 정보 HTML을 가져옵니다.
 * CORS를 피하기 위해 서버에서만 호출합니다.
 */
async function getMgfGuildInfoHtml(guildName: string): Promise<string> {
	const url = new URL(MGF_GUILD_INFO_PATH, MGF_ORIGIN)
	url.searchParams.set('g_name', guildName)

	return fetchMgfText(url, {
		headers: {
			Accept: 'text/html,application/xhtml+xml'
		},
		timeoutMessage: '길드 정보 조회 시간이 초과되었습니다.'
	})
}

export { getMgfGuildInfoHtml }
