/**
 * 직업 → public/companions 파일명.
 * 길드 초상화·동료 UI가 같은 이미지를 씁니다. (png · webp)
 */
const JOB_PORTRAIT_FILE_BY_JOB = {
	히어로: 'hero.png',
	팔라딘: 'paladin.png',
	다크나이트: 'darkknight.png',
	소울마스터: 'soulMaster.webp',
	썬콜: 'mage_sc.png',
	불독: 'mage_fd.png',
	비숍: 'bishop.png',
	플레임위자드: 'flameWizard.webp',
	보우마스터: 'bowmaster.png',
	신궁: 'marksman.png',
	나이트로드: 'nightlord.png',
	섀도어: 'shadower.png',
	바이퍼: 'viper.png',
	캡틴: 'captain.png',
	나이트워커: 'nightwalker.png',
	윈드브레이커: 'windbreaker.png'
} as const satisfies Record<string, string>

/** 직업 초상화 public 경로. 매핑이 없으면 빈 문자열. */
function getJobPortraitSrc(job: string) {
	const fileName = JOB_PORTRAIT_FILE_BY_JOB[job as keyof typeof JOB_PORTRAIT_FILE_BY_JOB]
	return fileName ? `/companions/${fileName}` : ''
}

export { getJobPortraitSrc }
