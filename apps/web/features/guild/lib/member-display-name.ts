/**
 * 대외 공개 시 실명 대신 쓸 표시용 별칭을 만듭니다.
 * 같은 실명은 항상 같은 별칭이 나오도록 해시로 고정합니다.
 * (조인·Select value 등 내부 키는 실명을 그대로 씁니다.)
 */

/** 실명에서 안정적인 숫자 시드를 뽑습니다 */
function hashMemberName(name: string): number {
	let hash = 0

	for (let index = 0; index < name.length; index += 1) {
		hash = (hash * 31 + name.charCodeAt(index)) >>> 0
	}

	return hash
}

/** 해시 → 4자리 대문자 16진수 (예: A3F2) */
function toAliasCode(hash: number): string {
	return hash.toString(16).toUpperCase().padStart(4, '0').slice(-4)
}

/**
 * 잠금 상태에서 화면에 보여줄 이름.
 * DOM에 실명이 노출되지 않도록 별칭만 반환합니다.
 */
function getMaskedMemberName(realName: string): string {
	const code = toAliasCode(hashMemberName(realName))
	return `모험가_${code}`
}

/** 잠금 여부에 따라 실명 또는 별칭을 반환합니다 */
function getMemberDisplayName(realName: string, isUnlocked: boolean): string {
	return isUnlocked ? realName : getMaskedMemberName(realName)
}

export { getMaskedMemberName, getMemberDisplayName }
