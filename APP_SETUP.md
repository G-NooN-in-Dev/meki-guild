# 새 앱 초기 세팅 가이드

`apps/*`에 새 프로젝트를 추가할 때, 아래 순서로 공통 세팅을 적용합니다.

## 1) 앱 생성

원하는 방식으로 `apps/<app-name>`을 생성합니다.

예시:

```sh
pnpm dlx create-next-app@latest apps/my-app --ts --app --eslint
```

## 2) 의존성 연결

`apps/<app-name>/package.json`에 workspace 의존성을 추가합니다.

- `@shared/eslint-config`
- `@shared/tailwind-config`
- `@shared/typescript-config`
- 필요 시 `@shared/ui`

## 3) Tailwind/PostCSS 공통화 (v4)

`apps/<app-name>/postcss.config.mjs`

```js
export { default } from '@shared/tailwind-config/postcss'
```

`apps/<app-name>/global.css`

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
@import 'tailwindcss';
@import '@shared/tailwind-config/base.css';

/* @shared/ui 등 워크스페이스 패키지를 쓰는 경우 */
@source '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}';
```

- Tailwind v4에서는 `tailwind.config.mjs`를 두지 않습니다.
- 디자인 토큰은 `@shared/tailwind-config/theme.css`만 수정합니다.
- `@source`는 `global.css` 파일 위치 기준 상대 경로로 조정합니다.

## 4) 전역 스타일/폰트 세팅

`apps/<app-name>/app/layout.tsx`

- `import '@/global.css'` 추가
- 기본 폰트는 Pretendard 스택을 사용하므로 `next/font/google` 중복 적용은 피합니다.

## 5) ESLint/TypeScript 공통화

- 앱의 `eslint.config.mjs`는 `@shared/eslint-config/next-js`를 사용
- `tsconfig.json`은 `@shared/typescript-config` 확장 방식 유지

## 6) 반응형 기본 원칙

- 구현 우선순위: 데스크탑 먼저, 모바일/태블릿 보완
- 코드 작성 방식: mobile-first (`base -> xxs -> xs -> md -> lg`)

## 7) 검증

```sh
pnpm --filter <app-name> lint
pnpm --filter <app-name> check-types
pnpm --filter <app-name> dev
```

## 8) 문서 업데이트

새 앱 추가 후 아래 문서를 함께 갱신합니다.

- 루트 `README.md`의 앱 목록
- `apps/<app-name>/README.md` (한글)
