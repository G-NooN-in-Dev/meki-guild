# 아키텍처

meki-guild `apps/web`의 라우트·레이어·데이터 흐름을 정리합니다.

## 라우트 맵

| 경로                      | 역할                                           |
| ------------------------- | ---------------------------------------------- |
| `/`                       | 사이트 허브 (길드 / 팁 진입)                   |
| `/guild`                  | 길드 대시보드 (게이트 + 실명 마스킹, 3주 차트) |
| `/guild/detail/[section]` | 길드 상세 (overview · bounty · expedition 등)  |
| `/guild/register`         | 길드 주간 데이터 Sheets 등록                   |
| `/tips`                   | 정보·팁 허브                                   |
| `/tips/*`                 | 개별 팁 (동료·유물·스테이지·던전·명중컷 등)    |
| `/updates`                | 사이트 업데이트 일지                           |

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
data/                   # current / previous / older week + content-dates JSON
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
  SnapLoader["libs/guild-snapshot.loader.ts"]
  DashLoader["libs/guild-dashboard.loader.ts"]
  DetailLoader["libs/guild-detail.loader.ts"]
  Diff["주간 증감 · 순위 (compare-snapshots)"]
  DashUI["/guild"]
  DetailUI["/guild/detail"]
  RegisterUI["/guild/register"]
  Action[Server Action]
  Append["append-guild-sheet-row.server.ts"]

  Sheets -->|CSV fetch| Sync
  Sync --> JSON
  JSON --> SnapLoader
  JSON --> DashLoader
  JSON --> DetailLoader
  SnapLoader --> Diff
  Diff --> DetailUI
  Diff --> RegisterUI
  DashLoader --> DashUI
  DetailLoader --> DetailUI
  RegisterUI --> Action
  Action --> Append
  Append --> Sheets
```

대시보드·상세는 **최근 3주** 집계 시계열(차트)과 인원 변동을 사용합니다.  
상세 어워드·등록 프리필은 `loadGuildSnapshotData`의 **최신·직전 2주** 비교를 씁니다.

### 읽기

1. 운영자가 Sheets에 주간 데이터를 쌓거나, 사이트의 시트 입력 폼으로 행을 upsert합니다.
2. `pnpm guild:sync [mode]`가 탭별 CSV를 읽어 `current-week.json` / `previous-week.json` / `older-week.json` / `guild-content-dates.json`을 갱신합니다. (`mode`로 부분 동기화 가능)
3. `loadGuildDashboardData`가 3주를 집계해 `/guild` 차트·인원 변동에 넘깁니다.
4. `loadGuildDetailRosterData` / `loadGuildJobClassLineCards`가 상세 로스터·직업 탭에 넘깁니다.
5. `loadGuildSnapshotData`가 current·previous 비교를 상세 어워드·등록에 넘깁니다.

### 쓰기

- `/guild/register` → `submitGuildSheetForm` action → Google Sheets API upsert
- 필요 env: `GOOGLE_SHEETS_SHEET_ID`, `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`

### 주간 이월

- `pnpm guild:rotate <mode>`가 로컬 JSON에서 previous → older, current → previous 복사 후 current 필드를 초기화합니다.
- 상세 모드는 [`OPERATIONS.md`](./OPERATIONS.md) 참고.

## 접근 제어

- `/guild` layout: 클라이언트 비밀번호 게이트 + 실명 마스킹 (`NameRevealProvider`)
- 비밀번호는 클라이언트 번들에 포함되는 **대외용 소프트 가림**이며, 서버 인증·인가가 아닙니다.

## 의도적으로 없는 것

- 범용 REST API
- MongoDB — 스냅샷 JSON + Sheets만 사용 (레거시 헬퍼는 제거됨)
- 실시간 DB — 주간 배치 스냅샷 모델
