/**
 * 길드원 초상화 public 경로.
 * 파일명은 NFC 닉네임.png (apps/web/public/members).
 */
function getMemberPortraitSrc(name: string): string {
	return `/members/${encodeURIComponent(name)}.png`
}

export { getMemberPortraitSrc }
