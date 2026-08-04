/**
 * 수정 화면 진입 직후, 검증된 CUD 비밀번호를 잠깐 보관합니다.
 * URL에 넣지 않고 sessionStorage만 쓰며, 저장·취소 후 지웁니다.
 * 동료/유물 컨설팅이 같은 API를 쓰고, kind로 키를 구분합니다.
 */

type ConsultingEditPasswordKind = 'companion' | 'relic'

/** kind별 prefix — 이미 저장된 세션 키와 호환을 유지합니다. */
const POST_EDIT_PASSWORD_PREFIX = {
	companion: 'consulting-post-edit-password:',
	relic: 'relic-consulting-post-edit-password:'
} as const satisfies Record<ConsultingEditPasswordKind, string>

function getConsultingEditPasswordKey(kind: ConsultingEditPasswordKind, shortId: string) {
	return `${POST_EDIT_PASSWORD_PREFIX[kind]}${shortId}`
}

function storeConsultingEditPassword(kind: ConsultingEditPasswordKind, shortId: string, password: string) {
	sessionStorage.setItem(getConsultingEditPasswordKey(kind, shortId), password)
}

function readConsultingEditPassword(kind: ConsultingEditPasswordKind, shortId: string): string | null {
	return sessionStorage.getItem(getConsultingEditPasswordKey(kind, shortId))
}

function clearConsultingEditPassword(kind: ConsultingEditPasswordKind, shortId: string) {
	sessionStorage.removeItem(getConsultingEditPasswordKey(kind, shortId))
}

export {
	clearConsultingEditPassword,
	getConsultingEditPasswordKey,
	readConsultingEditPassword,
	storeConsultingEditPassword
}
export type { ConsultingEditPasswordKind }
