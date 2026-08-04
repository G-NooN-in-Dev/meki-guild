# AGENTS.md

이 레포에서 작업하는 AI 에이전트를 위한 **인덱스**입니다.  
상세 규칙은 아래 문서를 따르고, 로컬 `.cursor/rules`는 요약·체크리스트만 유지합니다.

합의된 새 스타일은 [`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)에 반영합니다. rules에는 요약만 둡니다.

## 문서 링크

| 주제                                                                | 문서                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 문서 맵                                                             | [`docs/README.md`](docs/README.md)                                         |
| 코딩 가이드 (함수·컴포넌트·TS·React 19·주석·Tailwind·반응형·레이어) | [`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)                   |
| 커밋 메시지                                                         | [`docs/COMMIT_MESSAGE_GUIDE.md`](docs/COMMIT_MESSAGE_GUIDE.md)             |
| 신규 앱 세팅                                                        | [`docs/APP_SETUP.md`](docs/APP_SETUP.md)                                   |
| `@shared/ui`                                                        | [`packages/ui/README.md`](packages/ui/README.md)                           |
| Tailwind 공통 설정                                                  | [`packages/tailwind-config/README.md`](packages/tailwind-config/README.md) |

## 한 줄 원칙

- 응답·문서는 한글 우선, 변경은 작게, 관련 린트/타입을 확인합니다.
- 패키지 매니저는 `pnpm`, 앱 단위 실행은 `turbo --filter`, 공통 설정은 `@shared/*`를 재사용합니다.
- UI는 `@shared/ui`를 우선 재사용합니다.
- 비밀값·토큰은 커밋·문서화하지 않습니다.
- 명시적 구현 요청이 없으면 레포에 코드를 바로 수정하지 않습니다. (가이드·질문은 예시 코드까지 가능)
