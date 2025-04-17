module.exports = {
  root: true,
  extends: [
    require.resolve('@khulnasoft/style-guide/eslint/node'),
    require.resolve('@khulnasoft/style-guide/eslint/typescript'),
  ],
  ignorePatterns: ['packages/*/dist/**'],
  overrides: [
    {
      files: ['**/*.test.ts'],
      extends: [require.resolve('@khulnasoft/style-guide/eslint/jest')],
    },
  ],
};
