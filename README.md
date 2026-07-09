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
- `APP_SETUP.md` (새 앱 공통 초기 세팅 가이드)
- `COMMIT_MESSAGE_GUIDE.md` (커밋 메시지 규칙 가이드)
- `.github/JIRA_SETUP.md` (GitHub Actions ↔ Jira 연동·Secrets 설정)
