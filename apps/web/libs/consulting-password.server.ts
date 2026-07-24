import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

/** scrypt 출력 바이트 수 */
const SCRYPT_KEYLEN = 64

/**
 * 컨설팅 CUD용 비밀번호 해시.
 * 형식: `saltHex:hashHex` — 평문은 저장하지 않습니다.
 */
export function hashConsultingPassword(password: string): string {
	const salt = randomBytes(16).toString('hex')
	const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
	return `${salt}:${hash}`
}

/**
 * 입력 비밀번호와 저장된 해시를 비교합니다.
 * 형식이 깨졌거나 길이가 다르면 false.
 */
export function verifyConsultingPassword(password: string, stored: string): boolean {
	const [salt, expectedHex] = stored.split(':')
	if (!salt || !expectedHex) {
		return false
	}

	const actual = scryptSync(password, salt, SCRYPT_KEYLEN)
	const expected = Buffer.from(expectedHex, 'hex')
	if (actual.length !== expected.length) {
		return false
	}

	return timingSafeEqual(actual, expected)
}
