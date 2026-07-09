import { config } from '@shared/eslint-config/react-internal'

/** @type {import("eslint").Linter.Config[]} */
export default [
	...config,
	{
		// shadcn 생성 타입 시그니처의 콜백 인자명은 문서용이라 미사용 경고를 제외한다.
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
		}
	}
]
