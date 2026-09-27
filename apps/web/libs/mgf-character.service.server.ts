import { createHash } from 'node:crypto'

import { fetchMgfText, MGF_ORIGIN } from './mgf.client.server'

const MGF_CHARACTER_PATH = '/contents/character.php'
/** PoW nonce 상한 (mgf 클라이언트와 동일) */
const MGF_POW_NONCE_LIMIT = 5_000_000

type MgfChallengeResponse = {
	challenge: string
	difficulty: number
	c_t: number
	c_sig: string
}

/**
 * mgf.gg 캐릭터 페이지 HTML을 가져옵니다.
 * character.php는 Hashcash 스타일 PoW(hg_challenge)를 요구하므로
 * 1) 인증값 발급 → 2) nonce 탐색 → 3) 쿠키 동봉 재요청 순으로 호출합니다.
 */
async function getMgfCharacterHtml(nickname: string): Promise<string> {
	const nick = nickname.trim()
	const cookieJar = new Map<string, string>()

	const challenge = await fetchMgfChallenge(nick, cookieJar)
	const nonce = solveMgfPow(challenge.challenge, challenge.difficulty)

	if (nonce === null) {
		throw new Error('캐릭터 조회 인증을 통과하지 못했습니다.')
	}

	const url = new URL(MGF_CHARACTER_PATH, MGF_ORIGIN)
	url.searchParams.set('n', nick)
	url.searchParams.set('hg_challenge_v', challenge.challenge)
	url.searchParams.set('hg_c_t', String(challenge.c_t))
	url.searchParams.set('hg_c_sig', challenge.c_sig)
	url.searchParams.set('hg_nonce', String(nonce))

	const html = await fetchMgfText(url, {
		cookieJar,
		headers: {
			Accept: 'text/html,application/xhtml+xml'
		},
		timeoutMessage: '캐릭터 정보 조회 시간이 초과되었습니다.'
	})

	// PoW 실패·만료 시 게이트(로딩) HTML이 다시 내려옵니다.
	if (html.includes('id="hg-loading"') || html.includes('캐릭터 정보를 불러오는 중')) {
		throw new Error('캐릭터 정보 인증에 실패했습니다. 잠시 후 다시 시도해 주세요.')
	}

	return html
}

async function fetchMgfChallenge(nickname: string, cookieJar: Map<string, string>): Promise<MgfChallengeResponse> {
	const url = new URL(MGF_CHARACTER_PATH, MGF_ORIGIN)
	url.searchParams.set('hg_challenge', '1')
	url.searchParams.set('n', nickname)

	const text = await fetchMgfText(url, {
		cookieJar,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'X-Requested-With': 'XMLHttpRequest'
		},
		timeoutMessage: '캐릭터 정보 조회 시간이 초과되었습니다.'
	})

	let parsed: unknown

	try {
		parsed = JSON.parse(text) as unknown
	} catch {
		throw new Error('캐릭터 조회 인증 응답이 올바르지 않습니다.')
	}

	if (!isMgfChallengeResponse(parsed)) {
		throw new Error('캐릭터 조회 인증값을 받지 못했습니다.')
	}

	return parsed
}

function isMgfChallengeResponse(value: unknown): value is MgfChallengeResponse {
	if (!value || typeof value !== 'object') {
		return false
	}

	const { challenge, difficulty, c_t, c_sig } = value as Record<string, unknown>

	return (
		typeof challenge === 'string' &&
		challenge.length > 0 &&
		typeof difficulty === 'number' &&
		Number.isFinite(difficulty) &&
		difficulty >= 0 &&
		typeof c_t === 'number' &&
		Number.isFinite(c_t) &&
		typeof c_sig === 'string' &&
		c_sig.length > 0
	)
}

/** challenge+nonce 의 SHA-256 hex 앞자리가 0*difficulty 인 nonce를 찾습니다. */
function solveMgfPow(challenge: string, difficulty: number): number | null {
	const prefix = '0'.repeat(Math.max(0, Math.trunc(difficulty)))

	for (let nonce = 0; nonce <= MGF_POW_NONCE_LIMIT; nonce += 1) {
		const hash = createHash('sha256').update(`${challenge}${nonce}`, 'utf8').digest('hex')

		if (hash.startsWith(prefix)) {
			return nonce
		}
	}

	return null
}

export { getMgfCharacterHtml }
