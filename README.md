# meki-guild

Turborepo 기반 모노레포입니다.

## 구성

- `apps/web`: Next.js 앱
- `packages/ui`: 공용 UI 컴포넌트
- `packages/eslint-config`: 공용 ESLint 설정
- `packages/typescript-config`: 공용 TypeScript 설정
- `packages/tailwind-config`: 공용 Tailwind/PostCSS 설정

## 주요 스크립트

```sh
pnpm dev
pnpm build
pnpm lint
pnpm check-types
```

## 개별 앱/패키지 실행

필터를 사용해 특정 워크스페이스만 실행할 수 있습니다.

```sh
pnpm turbo dev --filter=web
pnpm turbo build --filter=@shared/tailwind-config
```

## 참고 문서

- [Turborepo 문서](https://turborepo.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [`docs/README.md`](docs/README.md) — 문서 맵
- [`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md) — 코딩 가이드라인
- [`docs/APP_SETUP.md`](docs/APP_SETUP.md) — 새 앱 공통 초기 세팅
- [`docs/COMMIT_MESSAGE_GUIDE.md`](docs/COMMIT_MESSAGE_GUIDE.md) — 커밋 메시지 규칙
- [`AGENTS.md`](AGENTS.md) — AI 에이전트 인덱스
