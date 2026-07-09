# AGENTS.md

이 문서는 이 레포에서 작업하는 AI 에이전트를 위한 공통 가이드입니다.

## 기본 원칙

- 모든 사용자 응답과 새로 작성하는 문서는 한글을 우선 사용합니다.
- 요청되지 않은 대규모 리팩터링, 파일 이동, 의존성 교체는 하지 않습니다.
- 변경은 가능한 한 작고 명확하게 수행합니다.
- 변경 후에는 관련 범위에서 린트/타입 오류 여부를 확인합니다.

## 모노레포 작업 규칙

- 패키지 매니저는 `pnpm`을 사용합니다.
- 앱/패키지 단위 실행은 `turbo --filter`를 우선 사용합니다.
- 공통 설정은 각 앱에서 중복 정의하지 않고 공유 패키지를 우선 사용합니다.

## 스타일/디자인 시스템 규칙

- Tailwind v4 설정은 `packages/tailwind-config`를 기준으로 사용합니다. 디자인 토큰은 `theme.css`(`@theme`)만 수정합니다.
- 앱 `global.css`는 `@import 'tailwindcss'` 후 `@shared/tailwind-config/base.css`를 import합니다. `tailwind.config.mjs`는 사용하지 않습니다.
- 새 색상/토큰 추가 시 기존 토큰 네이밍 규칙(`grayscale`, `success` 등)을 따릅니다.
- 반응형 구현 우선순위는 데스크탑 먼저, 모바일/태블릿 보완 순서로 진행합니다.
- 최종 코드 작성 시에는 mobile-first Tailwind 문법을 유지하고, `xxs -> xs -> md -> lg` 순으로 확장합니다.
- 폰트 기본값은 Pretendard 우선 스택을 유지합니다.

## 문서 규칙

- README/가이드 문서는 한글로 작성합니다.
- 새 설정이나 토큰을 추가하면 관련 문서(`README.md`, `CONFIG_REFERENCE.md`)도 함께 업데이트합니다.
- 신규 앱 온보딩은 루트 `APP_SETUP.md`를 기준으로 진행합니다.
- `services/`·`utils/` 레이어(service/loader, `.server.ts`)는 `.cursor/rules/web-services-utils-layers.mdc`를 따릅니다.

## TypeScript 코딩 컨벤션

- 구조분해할당, `satisfies`/`as` 사용 기준은 `.cursor/rules/typescript-conventions.mdc`를 따릅니다.
- 합의된 스타일은 작업 중 `.cursor/rules/`에 우선 기록하고, 프로젝트 마무리 시 컨벤션 문서로 통합·정리합니다.

## React 컴포넌트 템플릿

- 새 UI 컴포넌트는 `function` 선언 + 파일 하단 `export default` 패턴을 사용합니다.
- 파일명은 kebab-case이며, 섹션 컴포넌트는 `example.section.tsx`처럼 역할 접미사를 붙일 수 있습니다.
- 컴포넌트명은 파일명의 `-`, `.` 단위를 PascalCase로 합칩니다. (예: `example.section.tsx` → `ExampleSection`)
- 상세 템플릿·예시는 `.cursor/rules/react-component-template.mdc`를 참고합니다.
- `page.tsx`, `layout.tsx` 등 Next.js 라우트 파일은 프레임워크 규칙을 우선합니다.

## 변경 안전 규칙

- 비밀값, 토큰, 인증정보는 커밋/문서화하지 않습니다.
- 기존 동작을 바꾸는 변경은 영향 범위를 간단히 문서나 답변에 명시합니다.
