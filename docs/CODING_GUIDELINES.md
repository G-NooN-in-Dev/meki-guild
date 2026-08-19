# 코딩 가이드라인

이 문서는 이 레포(및 동일 스택을 복제한 프로젝트)의 **코딩 컨벤션 단일 소스(SSOT)** 입니다.  
에이전트용 `.cursor/rules`는 요약·체크리스트만 두고, **상세는 이 문서를 따릅니다**.

> 다른 레포로 복제할 때: 프로젝트명·앱 경로(`apps/web`)·도메인 예시(weather)만 바꿔도 대부분 그대로 쓸 수 있습니다.

---

## 1. 원칙

- 사용자 응답·README/가이드 문서는 **한글**을 우선합니다.
- 요청되지 않은 대규모 리팩터링·의존성 교체는 하지 않습니다. 변경은 **작고 명확하게** 유지합니다.
- 변경 후에는 관련 범위에서 **린트/타입** 오류를 확인합니다.
- 비밀값·토큰·인증정보는 커밋·문서화하지 않습니다.
- 기존 동작을 바꾸는 변경은 영향 범위를 답변·문서에 짧게 명시합니다.

합의된 새 스타일은 **이 문서에 반영**합니다. 로컬 `.cursor/rules`에는 요약만 둡니다.

---

## 2. 함수 선언

### 기본 원칙

- **export되는 컴포넌트·유틸·서비스 함수**는 `function` 선언을 사용합니다.
- **짧은 로컬 헬퍼**는 `const` 화살표 함수를 사용합니다.

### 유틸/라이브러리 함수

- 파일의 주요 함수는 `function` 선언 + 파일 하단 `export { fn }` 패턴을 사용합니다.
- 값과 타입을 함께 내보낼 때는 `export`와 `export type` 블록을 분리합니다.

```ts
function createHourlyWeatherTimeline() {
	// ...
}

type HourlyWeatherTimeline = {
	// ...
}

export { createHourlyWeatherTimeline }
export type { HourlyWeatherTimeline }
```

### 타입 정의 파일 (`*.type.ts` 등)

- 공개 타입은 `type TypeName = ...`로 선언하고, 파일 하단에서 `export type { TypeName }`로 한 번만 보냅니다.
- 선언부에 `export type`을 붙이지 않습니다.

```ts
type WeatherSummary = {
	realtime: WeatherApiRealtimeResponse
	forecast: WeatherApiForecastResponse
}

export type { WeatherSummary }
```

### `const` 화살표 함수를 쓰는 경우

- 컴포넌트/함수 내부의 작은 헬퍼
- `map`, `filter` 등에 넘기는 짧은 콜백
- 한 파일 안에서만 쓰는 간단한 변환 함수

```ts
const isNavActive = (pathname: string, href: string) => pathname === href
```

### 선택 기준 요약

| 상황                        | 권장                                               |
| --------------------------- | -------------------------------------------------- |
| export 컴포넌트             | `function` + `export default`                      |
| export 유틸 함수            | `function` + `export { fn }` + `export type { T }` |
| 타입 전용 파일              | `export type { T }`                                |
| 파일 내부 짧은 헬퍼         | `const` 화살표 함수                                |
| `this` 바인딩이 필요한 경우 | `function` (실무에서는 드묾)                       |

---

## 3. React 컴포넌트

### 작성 패턴

- `function` 선언으로 컴포넌트를 정의합니다.
- 파일 하단에서 `export default`로 보냅니다.
- `export default function ...` 인라인 export는 사용하지 않습니다.
- 클래스 컴포넌트·레거시 string ref·function component의 `defaultProps`는 사용하지 않습니다.

**예외 — `packages/ui` (`@shared/ui`)**  
shadcn/ui 관례에 따라 **named export**(`export { Button }`)를 사용합니다. 앱(`apps/*`) 컴포넌트에만 위 default export 규칙을 적용합니다.

```tsx
function ComponentName() {
	return <div></div>
}

export default ComponentName
```

### 파일명·컴포넌트명

- 파일명은 **kebab-case**를 사용합니다.
- 섹션 등 역할이 있는 컴포넌트는 `example.section.tsx`처럼 **점(`.`)으로 역할 접미사**를 붙일 수 있습니다.
- 컴포넌트명은 파일명(확장자 제외)의 `-`, `.` 구분 단위를 각각 PascalCase로 합칩니다.

| 파일명                        | 컴포넌트명              |
| ----------------------------- | ----------------------- |
| `current-location.tsx`        | `CurrentLocation`       |
| `example.section.tsx`         | `ExampleSection`        |
| `current-weather.section.tsx` | `CurrentWeatherSection` |

### Next.js 라우트

- `page.tsx`는 `function` 선언 + 파일 하단 `export default`를 사용합니다. (`export default async function` 인라인 export 금지)
- `layout.tsx`의 `export const metadata`는 Next.js 관례에 따라 인라인 export를 허용합니다.

---

## 4. React 19

이 레포는 **React 19**를 사용합니다 (`apps/web`: `19.2.x`, React Compiler 활성).  
모든 React/Next UI 작업은 React 19 API·관례를 기준으로 하며, React 17/18 관례로 돌아가지 않습니다.

### 버전·환경

- `apps/web`의 `react` / `react-dom`을 기준으로 맞춥니다.
- `apps/web/next.config.ts`에 `reactCompiler: true` — 불필요한 `useMemo` / `useCallback`을 기본으로 추가하지 않습니다.
- 클라이언트 전용 값이 필요할 때만 `'use client'`를 사용합니다.

### 하이드레이션·클라이언트 전용 값

기기 시각·`window`·`localStorage`처럼 서버와 다른 값은 렌더에서 바로 읽지 않습니다.

- **선호:** `useSyncExternalStore` (예: `useIsClient` — 서버 `false`, 클라이언트 `true`)
- **지양:** 마운트 후 `useEffect` + `useState`로만 “클라 준비됨” 플래그를 세우는 패턴
- `Date.now()`를 `useSyncExternalStore`의 `getSnapshot`에 매 호출마다 넣지 않습니다 (매 렌더 값이 바뀌면 tearing 경고)

```tsx
// ✅ 클라이언트에서만 현재 시각으로 계산
const isClient = useIsClient()
const status = isClient ? createSunriseStatus(today, tomorrow, dayjs()) : null
```

### React 19 API 우선

| 상황                              | 사용                                            |
| --------------------------------- | ----------------------------------------------- |
| Promise·Context 읽기 (클라이언트) | `use()`                                         |
| form / 서버 액션 상태             | `useActionState`, `useFormStatus`               |
| 낙관적 UI                         | `useOptimistic`                                 |
| ref                               | `forwardRef` 없이 **ref를 일반 prop**으로 받음  |
| 문서 head                         | 컴포넌트 트리 안 `<title>` / `<meta>` (필요 시) |

### 금지·주의

- React 18 이전 문서의 `ReactDOM.render` / 구 Concurrent 모드 설명을 전제로 한 코드 제안 금지

---

## 5. TypeScript

### 구조분해할당

- 객체·배열에서 값을 꺼낼 때 **구조분해할당을 우선** 사용합니다.
- 함수 인자도 가능하면 구조분해합니다.

```ts
// ❌ 반복 접근
const lat = location.lat
const lng = location.lng

// ✅ 구조분해
const { lat, lng, label } = location
```

```ts
// ❌
function writeCookie(location: LocationState) {
	document.cookie = `${name}=${location.lat}`
}

// ✅
function writeCookie({ lat, lng, label }: LocationState) {
	// ...
}
```

- 외부 JSON(`JSON.parse`, `fetch().json()`)은 **검증 후** 구조분해합니다.

### `satisfies` vs `as` — 개념

둘 다 “이 값이 이 타입이다”와 관련되지만 **역할이 다릅니다.**

|               | `satisfies Type`                                                | `as Type` (타입 단언)                                           |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| **하는 일**   | 값이 `Type`에 **맞는지 검사**하면서, 값 자체의 좁은 타입은 유지 | 컴파일러에게 “이건 `Type`이다”라고 **믿게 함** (검사 거의 없음) |
| **틀렸을 때** | 컴파일 에러                                                     | 대부분 통과 → **런타임 버그 위험**                              |
| **비유**      | 출고 전 스펙 검사                                               | “스펙 맞다고 스티커만 붙임”                                     |

```ts
type RecentLocationCookie = { lat: number; lng: number; label?: string }

// ✅ satisfies — 객체를 직접 만들 때. 필드 오타·타입 불일치면 컴파일 단계에서 잡힘.
//    값은 여전히 { lat, lng, label } 리터럴로 추론됨.
const payload = JSON.stringify({ lat, lng, label } satisfies RecentLocationCookie)

// ❌ as — 검사 없이 통과. lat를 문자열로 넣어도 컴파일이 될 수 있음.
const bad = { lat: '37', lng: 127 } as RecentLocationCookie
```

`as const`는 또 다른 문법입니다. 객·배열을 **읽기 전용 리터럴**로 고정할 때 씁니다 (`satisfies`와 목적이 다름).

```ts
const TEMP_UNITS = ['C', 'F'] as const
// 타입: readonly ["C", "F"]
```

### 언제 무엇을 쓰나

| 상황                                                              | 권장                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| 직접 만든 객체 리터럴의 형태 검증                                 | `satisfies`                                                       |
| `JSON.parse` / `fetch().json()` / localStorage 등 **외부 데이터** | 타입 가드·런타임 검증 후 사용 (`as`/`satisfies`만으로는 **부족**) |
| DOM/라이브러리가 `unknown`·넓은 타입을 줄 때 좁히기               | 가능하면 가드. 불가피하면 `as` + 근거 주석                        |
| 제네릭 헬퍼 반환을 구체 타입으로 좁히기                           | `as T` 또는 검증 함수                                             |
| 리터럴 튜플/객체 고정                                             | `as const`                                                        |

```ts
// ❌ 외부 JSON에 as만 — 깨진 데이터도 ForecastAstroEntry로 믿게 됨
const parsed = JSON.parse(cached) as ForecastAstroEntry

// ✅ unknown으로 받은 뒤 가드로 좁힘
const parsed: unknown = JSON.parse(cached)
if (!isForecastAstroEntry(parsed)) return
// 여기서부터 parsed는 ForecastAstroEntry
```

```ts
// ⚠️ satisfies를 JSON.parse 결과에 붙여도 런타임 검증은 안 됨 (any/unknown 기반)
const parsed = JSON.parse(value) satisfies RecentLocationCookie // 실질 안전하지 않음
```

서비스 레이어에서 API 에러 shape만 확인한 뒤 본문을 제네릭 `T`로 넘기는 경우는 단계적으로 가드를 보강합니다. **클라·쿠키·localStorage 경계**는 가드를 우선 적용합니다.

---

## 6. 주석

구현·수정 시 사용자가 diff를 바로 보지 못할 수 있으므로, **이해를 돕는 주석**을 함께 둡니다.

### 달아야 하는 경우

- 타입·함수·모듈의 **역할과 사용 맥락**
- 비즈니스 의도, 데이터 흐름, 섹션/컴포넌트 연결처럼 코드만으로 드러나지 않는 내용
- 복잡한 변환·분기·매핑의 **이유** (한 줄이라도)

### 달지 않는 경우

- 변수명·함수명만으로 충분한 자명한 한두 줄
- 프레임워크 관례 보일러플레이트
- 의미가 이미 분명한 API 응답 타입의 개별 필드
- `@example` 등 JSDoc — 함수명·한 줄 설명으로 충분한 경우

### 스타일

- **한글 주석**을 우선합니다.
- 장문보다, 나중에 코드만 열어도 흐름을 따라갈 수 있는 **짧고 실용적인** 주석을 유지합니다.

---

## 7. UI / Tailwind

### `@shared/ui` 우선

- UI가 필요할 때는 직접 마크업을 새로 짜기보다 `@shared/ui`를 최대한 재사용합니다.
- import: `@shared/ui/<component>` (예: `@shared/ui/card`, `@shared/ui/button`)
- `cn` 유틸: `@shared/ui/utils`
- 패키지에 없을 때만 앱 로컬 또는 shadcn CLI → `packages/ui` 추가를 검토합니다.
- 상세: [`packages/ui/README.md`](../packages/ui/README.md)

### Tailwind 공통 설정

- 공통 설정은 `packages/tailwind-config`를 단일 소스로 사용합니다.
- 디자인 토큰은 `packages/tailwind-config/theme.css`의 `@theme`만 수정합니다. `tailwind.config.mjs`는 v4에서 사용하지 않습니다.
- 앱 `global.css`는 `@import 'tailwindcss'` 후 `@import '@shared/tailwind-config/base.css'` 순서를 유지합니다.
- `@shared/ui` 등 워크스페이스 패키지 클래스는 앱 `global.css`에 `@source`로 스캔 경로를 추가합니다.
- 새 색상/토큰은 기존 네이밍(`grayscale`, `success` 등)과 스케일을 유지합니다.
- 토큰 변경 시 `packages/tailwind-config/README.md`와 `CONFIG_REFERENCE.md`를 함께 갱신합니다.
- 상세 연동: [`packages/tailwind-config/README.md`](../packages/tailwind-config/README.md)

### Tailwind v4 canonical className

IntelliSense `suggestCanonicalClasses`("can be written as …")를 따릅니다. 임의값(`[…]`)은 토큰·shortcut이 없을 때만 씁니다.

**spacing / 크기 (rem → 스케일)** — 기본 spacing 1 = `0.25rem`이므로, 고정 rem은 `rem × 4` 스케일 클래스를 씁니다.

- `w-[60rem]` → `w-240`
- `h-[2.5rem]` → `h-10`
- `translate-x-[2.5rem]` → `translate-x-10`
- `mt-[16px]` → `mt-4`

**CSS 변수 / calc**

- `w-[var(--foo)]` → `w-(--foo)`
- `calc(-1 * var(--foo))` 형태 음수 오프셋 → `-left-(--foo)`
- `calc` 안의 `var(--foo)` → `calc((--foo)+…)`
- `h-[calc(--spacing(5.5))]` → `h-(--spacing(5.5))`

**shorthand**

- `flex-shrink-0` → `shrink-0`
- `flex-grow` → `grow`

새 className은 처음부터 canonical로 작성하고, shadcn CLI 추가 후에도 정규화합니다.

### 폰트

- 기본 폰트는 Pretendard 우선 스택을 유지합니다.
- `font-sans`는 Pretendard 기반 스택을 가리키도록 유지합니다.

---

## 8. 반응형

- **구현 우선순위:** 데스크탑 UI를 먼저 완성한 뒤 모바일/태블릿을 보완합니다.
- **최종 코드:** mobile-first Tailwind 문법을 유지합니다. base는 최소 안전 레이아웃, 데스크탑 완성 기준은 `lg:` 이상으로 분리합니다.
- 브레이크포인트: `xxs` → `xs` → `md` → `tab` → `lg` 순으로 확장합니다.
- `tab`(896px)은 md와 lg 사이가 필요할 때만 씁니다. (예: 유물 효과 4열 표)
- 폴더블/초소형은 `xxs`를 기준으로 보완합니다.

---

## 9. 앱 레이어 (`apps/web`)

이 레포의 `apps/web`은 도메인 모듈을 `libs/`에 둡니다. (다른 복제 레포의 `lib/`와 동일 역할)

### `*.service.ts` vs `*.loader.ts`

- **service**: 외부 API 엔드포인트 1건. URL·캐시·에러 변환.
- **loader**: 화면/API가 쓰는 조합. 여러 service를 묶고 앱 기본값·도메인 타입 반환.
- **의존:** `loader → service`만 허용. `page.tsx` / `route.ts`는 **loader**를 import합니다.
- **네이밍:** `get*()` = service, `load*()` = loader.
- 클라이언트 refetch는 `/api/*` Route Handler 경유.
- service가 아직 분리되지 않은 경우에도 loader 네이밍·역할을 우선 맞춥니다. (`libs/*.loader.ts` 등)

### `libs/` vs `utils/` vs `features/*/lib/`

- **`libs/`**: 도메인 상수·규칙·쿠키·에러 정규화·짧은 오케스트레이션·loader/server 모듈.
- **`utils/`**: 도메인 비의존 순수 헬퍼만.
- **`features/{name}/lib/`**: 해당 feature UI 전용 변환·액션.

### `*.ts` vs `*.server.ts`

- 공통(`{name}.ts`): `parse*` / `format*` / `normalize*` — 서버·클라 공용.
- 클라이언트(`{name}.ts`): `document.cookie` 읽기/쓰기.
- 서버(`{name}.server.ts`): `cookies()` / DB 등 서버 전용. `{name}.server.ts`에 `document` 금지, 클라 공용 `{name}.ts`에 `next/headers` 금지.

---

## 10. 모노레포

- 패키지 매니저: `pnpm`
- 앱/패키지 단위 실행: `turbo --filter` 우선
- 공통 설정은 앱에 중복 정의하지 않고 `@shared/*`를 재사용합니다.
- 신규 앱 추가: [`docs/APP_SETUP.md`](./APP_SETUP.md)

---

## 관련 문서

- [문서 맵](./README.md)
- [커밋 메시지 가이드](./COMMIT_MESSAGE_GUIDE.md)
- [신규 앱 세팅](./APP_SETUP.md)
- [에이전트 인덱스](../AGENTS.md)
