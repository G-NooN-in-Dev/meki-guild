/** 앱 배포 버전 — 헤더 등 UI에 표시할 때 사용합니다. */
export const APP_VERSION = '1.1.0'

/** 헤더·푸터 등에 표시할 버전 라벨 (예: v.0.1.1) */
export function formatAppVersionLabel(version: string = APP_VERSION): string {
	return `v.${version}`
}
