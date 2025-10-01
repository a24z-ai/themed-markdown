import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-tests/**',
      '**/dist-hooks-standalone/**',
      '**/dist-mcp-standalone/**',
      '**/coverage/**',
      '**/storybook-static/**',
      'tests/setup.js',
      'eslint.config.js',
      'eslint.config.strict.js',
      'jest.config.js',
      'webpack.config.js',
      'scripts/**',
      'examples/**',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.d.ts',
      '**/*.d.ts.map',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['.storybook/**', 'src/stories/**'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
      },
    },
    rules: {
      // Prevent star imports from relative paths only
      'no-restricted-imports': [
        'error', // Enforcing as error to prevent star imports
        {
          patterns: [
            {
              group: ['./*', '../*'],
              importNames: ['*'],
              message:
                'Star imports are not allowed from relative paths. Please use named imports instead.',
            },
          ],
        },
      ],
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  // Strict typing for local-search library
  {
    files: ['src/local-search/**/*.ts', 'src/local-search/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', // Stricter than default
    },
  },
  // Strict typing for cleaned directories - no any types allowed
  {
    files: [
      'src/validation/**/*.ts',
      'src/validation/**/*.tsx',
      'src/hooks/**/*.ts',
      'src/hooks/**/*.tsx',
      'packages/industry-theme/src/**/*.ts',
      'packages/industry-theme/src/**/*.tsx',
      'src/layers/**/*.ts',
      'src/layers/**/*.tsx',
      'src/mcp/**/*.ts',
      'src/mcp/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', // These directories have been cleaned of any types
    },
  },
  // Specific rules for index.ts files
  {
    files: ['**/index.ts'],
    rules: {
      // Prevent star exports only in index.ts files
      'no-restricted-syntax': [
        'error', // Enforcing as error to prevent star exports
        {
          selector: 'ExportAllDeclaration',
          message:
            'Star exports are not allowed in index.ts files. Please use named exports instead.',
        },
      ],
    },
  },
  // Configuration for Storybook files without project parser
  {
    files: [
      '.storybook/**/*.ts',
      '.storybook/**/*.tsx',
      'src/stories/**/*.ts',
      'src/stories/**/*.tsx',
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // Configuration for test files without project parser
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts', 'examples/**/*.ts'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      // Same rules but without type-aware ones (set to 'error' to enforce strictly)
      'no-restricted-imports': [
        'error', // Enforcing as error to prevent star imports
        {
          patterns: [
            {
              group: ['./*', '../*'],
              importNames: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'dist-*/**',
      'coverage/**',
      'storybook-static/**',
      '*.js',
      '!eslint.config.js',
      'webpack.config.js',
      'scripts/**',
    ],
  },
);
