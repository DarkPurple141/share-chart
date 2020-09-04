module.exports = {
  extends: [
    '@atlassian/observability/react',
    '@atlassian/observability/typescript',
  ],
  globals: {
    __VERSION__: true,
  },
  rules: {
    'max-len': 1,
    'import/order': 0,
    'arrow-parens': 0,
    'react/forbid-prop-types': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'import/no-cycle': 0,
    'import/no-unresolved': 0,
    'react/react-in-jsx-scope': 0,
  },
}
