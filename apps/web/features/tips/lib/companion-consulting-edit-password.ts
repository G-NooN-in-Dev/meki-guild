/**
 * 수정 화면 진입 직후, 검증된 CUD 비밀번호를 잠깐 보관합니다.
 * URL에 넣지 않고 sessionStorage만 쓰며, 저장·취소 후 지웁니다.
 */

const POST_EDIT_PASSWORD_PREFIX = 'consulting-post-edit-password:'

export function getConsultingPostEditPasswordKey(shortId: string) {
	return `${POST_EDIT_PASSWORD_PREFIX}${shortId}`
}

export function storeConsultingPostEditPassword(shortId: string, password: string) {
	sessionStorage.setItem(getConsultingPostEditPasswordKey(shortId), password)
}

export function readConsultingPostEditPassword(shortId: string): string | null {
	return sessionStorage.getItem(getConsultingPostEditPasswordKey(shortId))
}

export function clearConsultingPostEditPassword(shortId: string) {
	sessionStorage.removeItem(getConsultingPostEditPasswordKey(shortId))
}
