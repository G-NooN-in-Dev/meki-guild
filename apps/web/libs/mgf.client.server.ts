const MGF_ORIGIN = 'https://mgf.gg'
const MGF_FETCH_TIMEOUT_MS = 20_000
const MGF_USER_AGENT = 'meki-guild/1.0 (+https://github.com; mgf proxy)'

/** mgf 프록시·파서 공통 에러. status는 API 응답 코드로 그대로 씁니다. */
class MgfRequestError extends Error {
	readonly status: number

	constructor(message: string, status: number) {
		super(message)
		this.name = 'MgfRequestError'
		this.status = status
	}
}

type FetchMgfOptions = {
	headers?: Record<string, string>
	/** 있으면 Cookie 전송 + Set-Cookie 수집 (character PoW용) */
	cookieJar?: Map<string, string>
	timeoutMs?: number
	timeoutMessage?: string
}

type FetchMgfBinaryResult = {
	body: ArrayBuffer
	contentType: string
	headers: Headers
}

/**
 * mgf.gg HTTP 텍스트 조회 (HTML/JSON).
 * CORS를 피하기 위해 서버에서만 호출합니다. 실시간 데이터라 캐시하지 않습니다.
 */
async function fetchMgfText(url: URL, options: FetchMgfOptions = {}): Promise<string> {
	const response = await fetchMgfResponse(url, options)
	return await response.text()
}

/**
 * mgf.gg 바이너리 조회 (초상화 등).
 * Referer를 붙이지 않아 핫링크 차단을 피합니다.
 */
async function fetchMgfBinary(url: URL, options: FetchMgfOptions = {}): Promise<FetchMgfBinaryResult> {
	const response = await fetchMgfResponse(url, options)
	const body = await response.arrayBuffer()
	const contentType = response.headers.get('content-type')?.split(';', 1)[0]?.trim() || 'application/octet-stream'

	return {
		body,
		contentType,
		headers: response.headers
	}
}

async function fetchMgfResponse(url: URL, options: FetchMgfOptions = {}): Promise<Response> {
	const {
		headers = {},
		cookieJar,
		timeoutMs = MGF_FETCH_TIMEOUT_MS,
		timeoutMessage = 'mgf.gg 조회 시간이 초과되었습니다.'
	} = options

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

	try {
		const requestHeaders: Record<string, string> = {
			'User-Agent': MGF_USER_AGENT,
			...headers
		}

		if (cookieJar) {
			const cookie = serializeCookieJar(cookieJar)
			if (cookie) {
				requestHeaders.Cookie = cookie
			}
		}

		const response = await fetch(url, {
			signal: controller.signal,
			headers: requestHeaders,
			cache: 'no-store'
		})

		if (cookieJar) {
			ingestSetCookie(cookieJar, response.headers)
		}

		if (!response.ok) {
			throw new Error(`mgf.gg 응답 오류 (${response.status})`)
		}

		return response
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(timeoutMessage)
		}

		throw error
	} finally {
		clearTimeout(timeoutId)
	}
}

/**
 * 브라우저용 same-origin 초상화 프록시 경로.
 * mgf ranking_image.php는 외부 Referer를 차단하므로 UI는 이 URL만 씁니다.
 */
function toMgfPortraitProxyUrl(nickname: string): string | null {
	const name = nickname.normalize('NFC').trim()
	if (!name) {
		return null
	}

	return `/api/tips/character-portrait?n=${encodeURIComponent(name)}`
}

/** `Lv. 109` / `Lv 12` 형태에서 레벨 숫자를 뽑습니다. */
function parseMgfLevel(text: string): number {
	const match = text.match(/Lv\.?\s*(\d+)/i)
	if (!match) {
		return 0
	}

	return Number.parseInt(match[1] ?? '0', 10)
}

function serializeCookieJar(cookieJar: Map<string, string>): string {
	return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
}

/** Set-Cookie 헤더에서 name=value 만 추출해 jar에 반영합니다. */
function ingestSetCookie(cookieJar: Map<string, string>, headers: Headers) {
	const rawList =
		typeof headers.getSetCookie === 'function'
			? headers.getSetCookie()
			: (() => {
					const single = headers.get('set-cookie')
					return single ? [single] : []
				})()

	for (const raw of rawList) {
		const pair = raw.split(';', 1)[0]?.trim()
		if (!pair) continue

		const eq = pair.indexOf('=')
		if (eq <= 0) continue

		const name = pair.slice(0, eq).trim()
		const value = pair.slice(eq + 1).trim()
		if (name) {
			cookieJar.set(name, value)
		}
	}
}

export { fetchMgfBinary, fetchMgfText, MGF_ORIGIN, MgfRequestError, parseMgfLevel, toMgfPortraitProxyUrl }
