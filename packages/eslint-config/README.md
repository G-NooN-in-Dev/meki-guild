# `@shared/eslint-config`

모노레포 내부에서 공통으로 사용하는 ESLint 설정 모음입니다.

## 의존성 참고

이 워크스페이스는 루트 `pnpm.overrides`에서 `resolve` 버전을 고정합니다.

일부 ESLint 플러그인(예: `eslint-plugin-import`, `eslint-plugin-react`)은 버전 범위에 따라 `resolve@2.0.0-next.x`를 선택할 수 있고, 이 경우 pnpm 워크스페이스에서 런타임 모듈 로딩 문제가 발생할 수 있습니다.

환경별 린트 동작을 안정적으로 유지하기 위해, 이 패키지에 직접 `resolve`를 추가하지 않고 루트에서 `1.x` 최신 라인으로 고정합니다.
