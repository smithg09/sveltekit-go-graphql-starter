module.exports = {
  // Frontend files
  'apps/**/*.{js,ts,svelte}': ['eslint --fix', 'prettier --write'],
  'packages/**/*.{js,ts,svelte}': ['eslint --fix', 'prettier --write'],

  // Backend Go files
  'services/core/**/*.go': (filenames) => {
    const files = filenames.join(' ');
    return [`gofmt -w ${files}`, `goimports -w ${files}`];
  },

  // GraphQL schemas
  '**/*.graphql': ['prettier --write'],

  // Config and documentation
  '*.{json,md,yml,yaml}': ['prettier --write'],

  // SQL migrations (just format, don't auto-fix)
  'services/core/db/migration/**/*.sql': ['prettier --write']
};
