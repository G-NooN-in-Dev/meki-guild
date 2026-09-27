import { MgfRequestError } from './mgf.client.server'
import { getMgfCharacterPortrait, type MgfCharacterPortrait } from './mgf-character-portrait.service.server'

/**
 * 닉네임으로 mgf 초상화를 조회합니다.
 * 비어 있으면 400, 업스트림 실패는 502로 변환합니다.
 */
async function loadMgfCharacterPortrait(nickname: string): Promise<MgfCharacterPortrait> {
	const trimmed = nickname.normalize('NFC').trim()

	if (!trimmed) {
		throw new MgfRequestError('닉네임을 입력해 주세요.', 400)
	}

	try {
		return await getMgfCharacterPortrait(trimmed)
	} catch (error) {
		if (error instanceof MgfRequestError) {
			throw error
		}

		const message = error instanceof Error ? error.message : '초상화를 조회하지 못했습니다.'
		throw new MgfRequestError(message, 502)
	}
}

export { loadMgfCharacterPortrait }
