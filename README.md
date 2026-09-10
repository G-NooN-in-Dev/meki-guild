# meki-guild

메이플키우기 1서버 **게임즈 길드** 공식 웹사이트 모노레포입니다.  
주간 스냅샷 기반 길드 대시보드, 1 vs 1 비교, 콘텐츠 팁 허브, 사이트 업데이트 일지를 제공합니다.

**데모:** [https://meki-games.vercel.app](https://meki-games.vercel.app)

## 주요 기능

| 영역          | 설명                                                |
| ------------- | --------------------------------------------------- |
| 사이트 허브   | 길드 정보 / 정보·팁 진입                            |
| 길드 대시보드 | 주간 스냅샷 요약, 멤버 테이블, 필터·정렬, 시트 입력 |
| 1 vs 1 비교   | 두 길드원 스펙 비교                                 |
| 정보 / 팁     | 동료·유물·스테이지·던전·길드 콘텐츠 명중컷 등       |
| 업데이트 일지 | 사이트 변경 로그                                    |

## 기술 스택

- **앱:** Next.js 16 (App Router), React 19 + React Compiler
- **모노레포:** pnpm + Turborepo
- **UI:** `@shared/ui` (Base UI / shadcn 스타일), Tailwind CSS v4, Lucide
- **데이터:** Google Sheets (수집·입력) → `apps/web/data/*.json` 정적 스냅샷
- **배포:** Vercel (`@vercel/analytics`)

## 아키텍처 요약

```text
Google Sheets ──sync──► data/*.json ──loader──► RSC pages / features
       ▲                                              │
       └──────── Server Action (시트 append/upsert) ──┘
```

상세: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · 운영: [`docs/OPERATIONS.md`](docs/OPERATIONS.md)

## 모노레포 구성

| 경로                         | 역할                              |
| ---------------------------- | --------------------------------- |
| `apps/web`                   | Next.js 앱 (유일한 제품 앱)       |
| `packages/ui`                | 공용 UI (`@shared/ui`)            |
| `packages/tailwind-config`   | Tailwind v4 토큰·PostCSS          |
| `packages/eslint-config`     | 공용 ESLint                       |
| `packages/typescript-config` | 공용 TypeScript                   |
| `scripts/`                   | `guild:sync` · `guild:rotate` CLI |

앱 상세: [`apps/web/README.md`](apps/web/README.md)

## 로컬 실행

```sh
pnpm install
pnpm dev
# 또는 앱만
pnpm turbo dev --filter=web
```

```sh
pnpm build
pnpm lint
pnpm check-types
```

길드 스냅샷 운영:

```sh
pnpm guild:sync              # Sheets → data/*.json
pnpm guild:rotate <mode>     # 주간 이월 (all | character | expedition | …)
```

환경 변수·운영 루틴은 [`docs/OPERATIONS.md`](docs/OPERATIONS.md)를 참고하세요.

## 문서 맵

| 문서                                                           | 설명                      |
| -------------------------------------------------------------- | ------------------------- |
| [`docs/README.md`](docs/README.md)                             | 문서 인덱스               |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                 | 라우트·레이어·데이터 흐름 |
| [`docs/OPERATIONS.md`](docs/OPERATIONS.md)                     | env · sync/rotate 운영    |
| [`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)       | 코딩 컨벤션 SSOT          |
| [`docs/APP_SETUP.md`](docs/APP_SETUP.md)                       | 신규 앱 세팅              |
| [`docs/COMMIT_MESSAGE_GUIDE.md`](docs/COMMIT_MESSAGE_GUIDE.md) | 커밋 메시지               |
| [`AGENTS.md`](AGENTS.md)                                       | AI 에이전트 인덱스        |

## License

See [LICENSE](LICENSE).
