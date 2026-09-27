# 아키텍처

meki-guild `apps/web`의 라우트·레이어·데이터 흐름을 정리합니다.

## 라우트 맵

| 경로                      | 역할                                                  |
| ------------------------- | ----------------------------------------------------- |
| `/`                       | 사이트 허브 (길드 / 팁 진입)                          |
| `/guild`                  | 길드 대시보드 (게이트 + 실명 마스킹 레이아웃)         |
| `/tips`                   | 정보·팁 허브                                          |
| `/tips/character-compare` | 캐릭터 1 vs 1 비교 (mgf 프로필)                       |
| `/tips/*`                 | 개별 팁 (동료·유물·스테이지·던전·명중컷·순위 예측 등) |
| `/updates`                | 사이트 업데이트 일지                                  |
| `/api/tips/*`             | tips용 mgf 프록시 (길드·캐릭터·초상화)                |

## 레이어

```text
app/                    # 라우트·metadata. loader만 호출
features/<domain>/
  sections/             # 페이지 본문 조합
  components/           # 도메인 UI
  lib/                  # feature 전용 로직·action·*.server.ts
  types/                # *.type.ts
  context/              # 클라이언트 컨텍스트 (예: 실명 공개)
components/             # 앱 공통 UI (header, PageShell, …)
libs/                   # 도메인 상수·loader·서버 헬퍼
utils/                  # 순수 헬퍼 (날짜·한국어 숫자 포맷)
data/                   # current-week / previous-week / content-dates JSON
```

규칙 요약 (상세: [`CODING_GUIDELINES.md`](./CODING_GUIDELINES.md) § 앱 레이어):

- `page` → `load*` loader만 호출
- `loader` → feature `lib` / 상수 조합
- 서버 전용은 `*.server.ts` 또는 `'use server'` action
- UI는 `@shared/ui` 우선, `cn`은 `@shared/ui/utils`

## 길드 데이터 흐름

```mermaid
flowchart LR
  Sheets[Google Sheets]
  Sync["scripts/sync-guild-sheet.mjs"]
  JSON["data/*.json"]
  Loader["libs/guild-snapshot.loader.ts"]
  Diff["주간 증감 · 순위 (compare-snapshots)"]
  UI[Guild Dashboard]
  Action[Server Action]
  Append["append-guild-sheet-row.server.ts"]

  Sheets -->|CSV fetch| Sync
  Sync --> JSON
  JSON --> Loader
  Loader --> Diff
  Diff --> UI
  UI --> Action
  Action --> Append
  Append --> Sheets
```

대시보드의 “비교”는 **주간 스냅샷 증감·길드 내 순위**입니다.  
캐릭터 1 vs 1 비교는 `/tips/character-compare`이며 아래 tips mgf 프록시를 씁니다.

### 읽기

1. 운영자가 Sheets에 주간 데이터를 쌓거나, 사이트의 시트 입력 폼으로 행을 upsert합니다.
2. `pnpm guild:sync [mode]`가 탭별 CSV를 읽어 `current-week.json` / `previous-week.json` / `guild-content-dates.json`을 갱신합니다. (`mode`로 부분 동기화 가능)
3. `loadGuildDashboardData`가 JSON을 파싱·주간 증감·순위 계산해 RSC에 넘깁니다.

### 쓰기

- `guild-sheet-form-dialog` → `submitGuildSheetForm` action → Google Sheets API upsert
- 필요 env: `GOOGLE_SHEETS_SHEET_ID`, `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`

### 주간 이월

- `pnpm guild:rotate <mode>`가 로컬 JSON에서 current → previous 복사 후 current 필드를 초기화합니다.
- 상세 모드는 [`OPERATIONS.md`](./OPERATIONS.md) 참고.

## 접근 제어

- `/guild` layout: 클라이언트 비밀번호 게이트 + 실명 마스킹 (`NameRevealProvider`)
- 비밀번호는 클라이언트 번들에 포함되는 **대외용 소프트 가림**이며, 서버 인증·인가가 아닙니다.

## 의도적으로 없는 것

- 범용 REST API — tips용 mgf 프록시(`/api/tips/*`)만 예외로 둡니다
- MongoDB — 스냅샷 JSON + Sheets만 사용 (레거시 헬퍼는 제거됨)
- 실시간 DB — 주간 배치 스냅샷 모델

## 예약 자산

`apps/web/public/members/*.png`는 멤버 초상화 등으로 쓸 수 있도록 둔 예약 자산입니다. 현재 TS 코드에서 필수로 참조하지는 않습니다.

## tips mgf 프록시

브라우저에서 `mgf.gg`를 직접 호출하지 않습니다. tips UI(캐릭터 비교·길드 순위 예측 등)는 `/api/tips/*`만 사용합니다.

| 경로                              | 역할                                                                   |
| --------------------------------- | ---------------------------------------------------------------------- |
| `/api/tips/guild-info?g_name=`    | 길드원 목록·전투력 등 JSON                                             |
| `/api/tips/character-info?n=`     | 캐릭터 비교용 프로필 JSON                                              |
| `/api/tips/character-portrait?n=` | 초상화 이미지 (same-origin). mgf `ranking_image.php` Referer 차단 우회 |

`portraitUrl` 필드는 `https://mgf.gg/...`가 아니라 `/api/tips/character-portrait?n=…` 상대 경로입니다.
