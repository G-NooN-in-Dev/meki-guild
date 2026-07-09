# @shared/tailwind-config

레포에서 공통으로 사용하는 Tailwind CSS v4 설정 패키지입니다.

디자인 토큰의 단일 소스는 `theme.css`(`@theme`)이며, 상세 사용법은 `CONFIG_REFERENCE.md`를 참고하세요.

## 앱 연동 템플릿

새 앱(`apps/*`) 추가 시 아래 템플릿을 그대로 사용하세요.

### 1) `postcss.config.mjs`

```js
export { default } from '@shared/tailwind-config/postcss'
```

### 2) `global.css`

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
@import 'tailwindcss';
@import '@shared/tailwind-config/base.css';

/* @shared/ui 등 워크스페이스 패키지를 쓰는 경우 (앱 global.css 기준 상대 경로) */
@source '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}';
```

- `tailwind.config.mjs`는 **v4에서 사용하지 않습니다.** 토큰은 `@shared/tailwind-config/theme.css`만 수정합니다.
- `@source`는 앱/스토리북의 `global.css`(또는 `preview.css`) 위치에 맞게 상대 경로를 조정합니다.

### 3) `app/layout.tsx`

- 전역 스타일을 한 번만 import:
  - `import '@/global.css'`
- 기본 폰트는 `global.css` / `theme.css`에서 관리하므로 `next/font/google` 중복 적용은 피합니다.

## 패키지 export

| 경로                                | 용도                                  |
| ----------------------------------- | ------------------------------------- |
| `@shared/tailwind-config/postcss`   | PostCSS (`@tailwindcss/postcss`)      |
| `@shared/tailwind-config/theme.css` | 공통 `@theme` 토큰 (직접 import 가능) |
| `@shared/tailwind-config/base.css`  | `theme.css` + `body` 기본 스타일      |

## 디자인 토큰 사용 가이드

- 기본 텍스트/보더는 `grayscale-*`를 우선 사용합니다.
- 파스텔 배경은 `pastel-*` 팔레트의 `100` 또는 `200` 단계 사용을 권장합니다.
- 파스텔 배경 위 텍스트는 `grayscale-700` 이상(더 진한 톤) 사용을 권장합니다.
- 상태색은 `DEFAULT` + 축약 스케일을 제공합니다.
  - `success|warning|danger|info`: `50`, `100`, `500`, `700`

## 반응형 가이드 (모바일/태블릿/데스크탑)

- 브레이크포인트:
  - 컴팩트 모바일: `xxs` (`>=320px`)
  - 모바일 기본: `<sm`
  - 태블릿: `md` (`>=768px`)
  - 데스크탑: `lg` 이상 (`>=1024px`)
- 모바일 우선으로 작성하고, `md`, `lg`에서 점진적으로 덮어씁니다.
- 매우 좁은 화면은 base/`xxs`부터 시작하고 `xs`에서 확장합니다.
- 페이지 레이아웃은 `container`와 폭 토큰을 조합합니다.
  - 페이지 셸: `container max-w-content`
  - 본문/설명: `max-w-reading` 또는 `max-w-prose`
- 모바일 브라우저 높이 변화 대응이 필요하면 `min-h-screen` 대신 `min-h-screen-safe`를 사용합니다.
- 권장 간격 패턴 예시:
  - `px-3 xxs:px-4 md:px-6 xl:px-8 py-10 md:py-16`

## 다른 레포로 복제할 때

1. `packages/tailwind-config` 패키지 전체를 복사합니다.
2. 앱 `global.css` / `postcss.config.mjs` 템플릿을 적용합니다.
3. `@source` 경로만 해당 레포 구조에 맞게 수정합니다.
