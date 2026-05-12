import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Pragmatic Architectural Enforcement:
      // Restrict UI components from importing services directly.
      'no-restricted-imports': [
        'error',
        {
          paths: [],
          patterns: [
            {
              group: ['@/services/**', '../../services/**', '../services/**'],
              message: 'UI Components in src/components must interact via viewmodels, eventBus, or action dispatchers—not direct service integration.',
            },
          ],
        },
      ],
    },
  }
);
