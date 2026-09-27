import { fetchMgfBinary, MGF_ORIGIN } from './mgf.client.server'

const MGF_PORTRAIT_PATH = '/ranking/ranking_image.php'

type MgfCharacterPortrait = {
	body: ArrayBuffer
	contentType: string
}

/**
 * mgf.gg 캐릭터 초상화 바이너리를 가져옵니다.
 * 닉네임만 받아 URL을 직접 조립합니다 (임의 URL 프록시/SSRF 방지).
 */
async function getMgfCharacterPortrait(nickname: string): Promise<MgfCharacterPortrait> {
	const name = nickname.normalize('NFC').trim()
	const url = new URL(MGF_PORTRAIT_PATH, MGF_ORIGIN)
	url.searchParams.set('n', name)

	const { body, contentType, headers } = await fetchMgfBinary(url, {
		headers: {
			Accept: 'image/*'
		},
		timeoutMessage: '초상화 조회 시간이 초과되었습니다.'
	})

	// Referer 없이 요청해도 차단되면 플레이스홀더 PNG가 내려옵니다.
	if (headers.get('x-mgf-blocked')) {
		throw new Error('초상화 조회가 차단되었습니다.')
	}

	if (body.byteLength === 0) {
		throw new Error('초상화 데이터가 비어 있습니다.')
	}

	return {
		body,
		contentType: contentType.startsWith('image/') ? contentType : 'image/png'
	}
}

export { getMgfCharacterPortrait }
export type { MgfCharacterPortrait }
