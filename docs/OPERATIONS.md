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

## `pnpm guild:sync [mode]`

스크립트: `scripts/sync-guild-sheet.mjs`

인자를 생략하거나 `all`이면 전체 탭을 읽어 JSON을 다시 만듭니다.  
`rotate`와 같은 mode를 주면 **해당 필드만** 기존 JSON에 병합합니다.

| mode           | 동기화 대상                        |
| -------------- | ---------------------------------- |
| (생략) / `all` | 전체 (로스터 포함 재구성)          |
| `character`    | 전투력·레벨·직업                   |
| `expedition`   | 토벌전 (+ 길드 토벌전 순위)        |
| `rivalry`      | 대항전 (+ 길드 대항전 순위·포인트) |
| `training`     | 수련장 (+ 길드 수련장 순위)        |
| `guild-boss`   | 길드보스                           |

동작 요약:

1. `apps/web` env를 로드합니다.
2. (전체) Sheets 탭을 CSV로 fetch → `collectedAt` 기준 최신·직전 스냅샷으로 JSON 재작성  
   (부분) 해당 탭(+ 필요 시 `guild`)만 fetch → 기존 멤버 목록을 유지한 채 필드·날짜만 갱신
3. 갱신 파일:
   - `apps/web/data/current-week.json`
   - `apps/web/data/previous-week.json`
   - `apps/web/data/guild-content-dates.json`

부분 sync는 기존 JSON이 있어야 합니다. 멤버 추가/삭제(로스터 변경)는 `pnpm guild:sync` 또는 `all`을 사용합니다.

배포 전에 sync한 JSON을 커밋하거나, CI/수동으로 반영한 뒤 빌드합니다.

## `pnpm guild:rotate <mode>`

스크립트: `scripts/rotate-guild-week.mjs`

로컬 JSON만 조작합니다. Sheets를 직접 바꾸지 않습니다.

| mode         | 이월·초기화 대상                     |
| ------------ | ------------------------------------ |
| `all`        | 전투력·토벌전·대항전·수련장·길드보스 |
| `character`  | 전투력·레벨·직업                     |
| `expedition` | 토벌전 (+ 길드 토벌전 순위)          |
| `rivalry`    | 대항전 (+ 길드 대항전 순위·포인트)   |
| `training`   | 수련장 (+ 길드 수련장 순위)          |
| `guild-boss` | 길드보스                             |

동작 요약:

1. 지정 필드를 `current` → `previous`로 복사
2. `current`의 해당 필드 초기화
3. 토벌전·대항전·수련장은 길드 메타(순위·포인트)도 함께 이월·초기화
4. KST 오늘 날짜로 `guild-content-dates.json` 갱신

새 주 시작 시 콘텐츠별로 rotate한 뒤, 수집·입력 → `guild:sync` 순서를 권장합니다.

## 주간 루틴 (권장)

1. (선택) 콘텐츠별 `guild:rotate`로 주차 경계 정리
2. Sheets / 사이트 폼으로 금주 데이터 수집
3. `pnpm guild:sync` 또는 콘텐츠별 `pnpm guild:sync <mode>`로 JSON 반영
4. 로컬에서 대시보드·비교 확인
5. JSON 커밋 또는 배포 파이프라인에 반영 후 Vercel 배포

## 관련 문서

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 데이터 흐름
- [`../apps/web/README.md`](../apps/web/README.md) — 앱 개발
