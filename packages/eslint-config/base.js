import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import { fileURLToPath } from 'url'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import eslintPluginImport from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import unicornPlugin from 'eslint-plugin-unicorn'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

const sharedTailwindConfigPath = fileURLToPath(new URL('../tailwind-config/theme.css', import.meta.url))

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
	js.configs.recommended,
	eslintConfigPrettier,
	pluginReact.configs.flat.recommended,
	...tseslint.configs.recommended,
	// 일반 rules
	{
		rules: {
			'no-unused-vars': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn'
		}
	},
	// turbo
	{
		plugins: {
			turbo: turboPlugin
		},
		rules: {
			'turbo/no-undeclared-env-vars': 'warn'
		}
	},
	// import
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			import: eslintPluginImport
		},
		rules: {
			'simple-import-sort/imports': 'warn',
			'simple-import-sort/exports': 'warn',
			'import/first': 'warn',
			'import/newline-after-import': 'warn',
			'import/no-duplicates': 'warn'
		}
	},
	// react-hooks
	{
		plugins: {
			'react-hooks': pluginReactHooks
		},
		settings: { react: { version: 'detect' } },
		rules: {
			...pluginReactHooks.configs.recommended.rules,
			// React scope no longer necessary with new JSX transform.
			'react/react-in-jsx-scope': 'off'
		}
	},
	// fileName
	{
		plugins: {
			unicorn: unicornPlugin
		},
		rules: {
			'unicorn/filename-case': [
				'error',
				{
					case: 'kebabCase',
					ignore: ['App.tsx']
				}
			]
		}
	},
	// tailwindcss
	...tailwindcssPlugin.configs['flat/recommended'],
	{
		settings: {
			tailwindcss: {
				config: sharedTailwindConfigPath,
				callees: ['classnames', 'clsx', 'ctl', 'cn', 'twMerge']
			}
		},
		rules: {
			'tailwindcss/classnames-order': 'off',
			'tailwindcss/no-custom-classname': 'off',
			'tailwindcss/no-contradicting-classname': 'warn',
			'tailwindcss/enforces-shorthand': 'warn',
			'tailwindcss/no-unnecessary-arbitrary-value': 'warn'
		}
	},
	{
		ignores: ['dist/**']
	}
]
