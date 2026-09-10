# apps/web

메이플키우기 1서버 게임즈 길드 사이트 (Next.js 앱).

데모: [https://meki-games.vercel.app](https://meki-games.vercel.app)

## 목적

- 주간 스냅샷 기반 **길드 대시보드** · **1 vs 1 비교**
- 콘텐츠 **정보/팁** (명중컷, 시뮬레이터 등)
- **업데이트 일지**

## 개발

루트에서:

```sh
pnpm turbo dev --filter=web
pnpm turbo lint --filter=web
pnpm turbo check-types --filter=web
pnpm turbo build --filter=web
```

앱 디렉터리에서:

```sh
pnpm dev
pnpm lint
pnpm check-types
pnpm build
```

시트 연동·스냅샷 운영은 루트 스크립트와 [`docs/OPERATIONS.md`](../../docs/OPERATIONS.md)를 따릅니다.

## Feature 관례

```text
features/
  guild/     # 대시보드 · 비교 · 시트 입력 · 접근 게이트
  tips/      # 팁 허브 · 개별 콘텐츠
  home/      # 사이트 허브
  updates/   # 변경 로그
```

- `sections/` — 페이지가 조립하는 본문
- `components/` — 도메인 UI
- `lib/` — 로직, Server Actions, `*.server.ts`
- `types/` — `*.type.ts`

공통 셸은 `@/components/page-shell`를 사용합니다.  
아키텍처·레이어 규칙: [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md), [`docs/CODING_GUIDELINES.md`](../../docs/CODING_GUIDELINES.md)

## 데이터

| 파일                            | 역할                 |
| ------------------------------- | -------------------- |
| `data/current-week.json`        | 금주 스냅샷          |
| `data/previous-week.json`       | 직전 스냅샷          |
| `data/guild-content-dates.json` | 콘텐츠별 수집일 메타 |

`libs/guild-snapshot.loader.ts`가 대시보드·비교 페이지 진입점입니다.

## 예약 자산

`public/members/*.png` — 멤버 초상화 등용 예약 이미지 (현재 필수 참조 아님).
