# Tailwind Theme 레퍼런스

이 문서는 `theme.css`의 공통 `@theme` 토큰과 사용법을 설명합니다.

토큰을 추가·변경할 때는 `theme.css`만 수정하고, 이 문서를 함께 갱신합니다.

## 다크 모드

- `@custom-variant dark`로 class 기반 다크 모드를 사용합니다.
- 루트에 `dark` 클래스를 붙여 제어합니다.
- 예시: `dark:bg-grayscale-900 dark:text-grayscale-100`

## container

- `--container-center: true` — 페이지 콘텐츠 중앙 정렬
- `--container-padding*` — 브레이크포인트별 좌우 여백
- 예시: `container max-w-content`

## breakpoints (`--breakpoint-*`)

- `xxs: 320px`, `xs: 480px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`
- 모바일 우선 설계:
  - base 스타일을 먼저 작성
  - 이후 `xxs:`, `xs:`, `md:`, `lg:` 순서로 확장

## fontFamily (`--font-*`)

- `font-sans`: Pretendard 우선 UI 폰트 스택
- `font-mono`: 코드/수치 표현용 모노 스택

## colors (`--color-*`)

- 파스텔 팔레트: `pastel-red`, `pastel-orange`, `pastel-yellow`, `pastel-green`, `pastel-blue`, `pastel-purple`
  - Tailwind 기본 색상명(`red`, `blue` 등)과 충돌하지 않도록 `pastel-` 접두사 사용
  - 각 팔레트는 기본값(`--color-pastel-red` 등)과 `50..950` 스케일 제공
- 기본 텍스트/보더: `grayscale`
- 상태색: `success`, `warning`, `danger`, `info`
  - `50`, `100`, `500`, `700` 및 기본값 제공
- `@shared/ui` 시맨틱 색상: `background`, `foreground`, `primary`, `secondary`, `muted`, `destructive`, `border`, `input`, `ring`
- `@shared/ui` 플로팅·오버레이: `popover`, `popover-foreground`, `card`, `card-foreground`, `accent`, `accent-foreground`
  - Dialog, Popover, Select, Combobox 등 `bg-popover` 사용 컴포넌트에 필요
- `@shared/ui` Sidebar: `sidebar`, `sidebar-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring` 등
- 원색: `pure-red`, `pure-green`, `pure-blue`, `pure-yellow`, `pure-cyan`, `pure-magenta`
  - RGB·CMY 순색 (`#ff0000`, `#00ff00`, `#0000ff` 등). Tailwind 기본·`pastel-*`·상태색과 겹치지 않음
  - 예: `text-pure-red`, `bg-pure-blue`

## fontSize (`--text-*`)

- `xs`부터 `3xl`까지, `--text-*--line-height`로 line-height 함께 정의
- 예: `text-base`, `text-2xl`

## borderRadius (`--radius-*`)

- `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, `rounded-pill`
- 권장 용도:
  - 컨트롤/칩: `rounded-pill`
  - 카드: `rounded-2xl`
  - 다이얼로그/강조 섹션: `rounded-3xl` 또는 `rounded-4xl`

## spacing (`--spacing-*`)

- 추가 토큰: `18`, `22`, `26`, `30`, `34`
- 예: `p-18`, `gap-22`

## boxShadow (`--shadow-*`)

- `shadow-soft`: 약한 높이감
- `shadow-card`: 카드형 UI 강조

## maxWidth (`--max-width-*`)

- `max-w-prose`: 긴 본문 텍스트
- `max-w-reading`: 설명/문단 블록
- `max-w-content`: 페이지 메인 셸

## minHeight (`--min-height-*`)

- `min-h-screen-safe` → `100dvh`
- 모바일 브라우저 동적 툴바 환경에 유리

## zIndex (`--z-index-*`)

- `z-dropdown`, `z-sticky`, `z-modal`, `z-toast`

## transitionTimingFunction (`--ease-*`)

- `ease-emphasized-in`
- `ease-emphasized-out`
- `ease-standard-productive`

## transitionDuration (`--transition-duration-*`)

- `duration-0`, `duration-400`

## backgroundImage (`--background-image-*`)

- Radial: `bg-radial-pastel-blue`, `bg-radial-pastel-red`, `bg-radial-pastel-purple`
- Linear: `bg-linear-sky`, `bg-linear-sunrise`, `bg-linear-mint`
- Multi-layer: `bg-mesh-soft`

## keyframes / animation

- `accordion-down`, `accordion-up`
- `animate-accordion-down`, `animate-accordion-up`
