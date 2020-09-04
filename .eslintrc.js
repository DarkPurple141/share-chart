module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  globals: {
    __DEPLOY_ENV__: true,
  },
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
}
