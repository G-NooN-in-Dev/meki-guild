/**
 * 유물 컨설팅 수정 화면 진입 직후, 검증된 CUD 비밀번호를 잠깐 보관합니다.
 * URL에 넣지 않고 sessionStorage만 쓰며, 저장·취소 후 지웁니다.
 */

const POST_EDIT_PASSWORD_PREFIX = 'relic-consulting-post-edit-password:'

export function getRelicConsultingPostEditPasswordKey(shortId: string) {
	return `${POST_EDIT_PASSWORD_PREFIX}${shortId}`
}

export function storeRelicConsultingPostEditPassword(shortId: string, password: string) {
	sessionStorage.setItem(getRelicConsultingPostEditPasswordKey(shortId), password)
}

export function readRelicConsultingPostEditPassword(shortId: string): string | null {
	return sessionStorage.getItem(getRelicConsultingPostEditPasswordKey(shortId))
}

export function clearRelicConsultingPostEditPassword(shortId: string) {
	sessionStorage.removeItem(getRelicConsultingPostEditPasswordKey(shortId))
}
