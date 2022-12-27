module.exports = {
  env: {
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',

    'no-console': ['warn', {allow: ['tron']}],
    'spaced-comment': ['error', 'always', {markers: ['/']}],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'default-case': 'off',
    'no-plusplus': 'off',

    // TypeScript
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    // React
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/prop-types': 'off',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React
    'react/require-default-props': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
      'babel-module': {},
    },
  },
  ignorePatterns: ['metro.config.js', '.eslintrc.js'],
};
