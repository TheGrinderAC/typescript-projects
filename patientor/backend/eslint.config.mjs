import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['node_modules', 'build', 'dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
      prettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'off',

      // Stylistic (delegated to Prettier)
      '@stylistic/quotes': 'off',
      '@stylistic/semi': 'off',

      // Base JS rule OFF (important)
      'no-unused-vars': 'off',

      // ✅ FIX: allow intentional unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Safety
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
