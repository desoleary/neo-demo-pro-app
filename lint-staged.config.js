module.exports = {
  '*.{js,ts,tsx,json,md,yaml,yml,graphql}': ['prettier --write'],
  '*.{ts,tsx}': ['eslint --fix'],
};
