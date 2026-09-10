# 운영 가이드

길드 스냅샷·시트 연동 운영 절차입니다. **비밀값·토큰·시트 ID 실값은 이 문서에 적지 않습니다.**

## 환경 변수

`apps/web/.env.local`(우선) 또는 `.env`에 둡니다. Vercel 프로젝트 env에도 동일 키를 설정합니다.

| 변수                         | 용도                                             |
| ---------------------------- | ------------------------------------------------ |
| `GOOGLE_SHEETS_SHEET_ID`     | 길드 스프레드시트 ID (`guild:sync` · Sheets API) |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | 서비스 계정 이메일 (시트 쓰기 Server Action)     |
| `GOOGLE_SHEETS_PRIVATE_KEY`  | 서비스 계정 키 (`\n` 이스케이프 가능)            |

읽기 전용 sync는 공개 CSV URL을 사용하므로, sync만 할 때는 `SHEET_ID`만 있어도 됩니다.  
사이트에서 시트 폼 제출을 쓰려면 서비스 계정 키 쌍이 필요합니다.

길드 구역 입장 비밀번호는 코드 상수(`name-reveal.constants`)로 관리합니다. 클라이언트 노출을 전제로 한 soft gate입니다.

## `pnpm guild:sync`

스크립트: `scripts/sync-guild-sheet.mjs`

1. `apps/web` env를 로드합니다.
2. Sheets 탭(`combatPower`, `expedition`, `rivalry`, `training`, `guildBoss`, `guild`)을 CSV로 fetch합니다.
3. `collectedAt` 기준으로 최신·직전 스냅샷을 만들어 다음 파일을 갱신합니다.
   - `apps/web/data/current-week.json`
   - `apps/web/data/previous-week.json`
   - `apps/web/data/guild-content-dates.json`

배포 전에 sync한 JSON을 커밋하거나, CI/수동으로 반영한 뒤 빌드합니다.

## `pnpm guild:rotate <mode>`

스크립트: `scripts/rotate-guild-week.mjs`

로컬 JSON만 조작합니다. Sheets를 직접 바꾸지 않습니다.

| mode         | 이월·초기화 대상                     |
| ------------ | ------------------------------------ |
| `all`        | 전투력·토벌전·대항전·수련장·길드보스 |
| `character`  | 전투력·레벨·직업                     |
| `expedition` | 토벌전                               |
| `rivalry`    | 대항전                               |
| `training`   | 수련장                               |
| `guild-boss` | 길드보스                             |

동작 요약:

1. 지정 필드를 `current` → `previous`로 복사
2. `current`의 해당 필드 초기화
3. KST 오늘 날짜로 `guild-content-dates.json` 갱신

새 주 시작 시 콘텐츠별로 rotate한 뒤, 수집·입력 → `guild:sync` 순서를 권장합니다.

## 주간 루틴 (권장)

1. (선택) 콘텐츠별 `guild:rotate`로 주차 경계 정리
2. Sheets / 사이트 폼으로 금주 데이터 수집
3. `pnpm guild:sync`로 JSON 반영
4. 로컬에서 대시보드·비교 확인
5. JSON 커밋 또는 배포 파이프라인에 반영 후 Vercel 배포

## 관련 문서

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 데이터 흐름
- [`../apps/web/README.md`](../apps/web/README.md) — 앱 개발
