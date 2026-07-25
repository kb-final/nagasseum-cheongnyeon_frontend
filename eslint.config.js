// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['dist/**', 'dist-ssr/**', 'node_modules/**'],
  },
  {
    rules: {
      'vue/multi-word-component-names': [
        'error',
        { ignores: ['Modal', 'Table', 'Pagination', 'Alert', 'Skeleton', 'Toast', 'Breadcrumb'] },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
]
