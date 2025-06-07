# CONTRIBUTING.md

## Code Quality

- Follow Prettier and ESLint rules.
- Run:

```bash
pnpm lint
pnpm format
```

before committing.

## Commit Format

- Use Conventional Commits:

```plaintext
feat(account): add new field to User type
fix(auth): correct JWT expiry bug
```

- Enforced via commitlint and husky.

## Pre-commit

- lint-staged auto-formats staged files.
- Run `pnpm lint-staged` manually if needed.

## Codegen

- Always run codegen after API changes:

```bash
pnpm turbo run generate
```

- Verify no unexpected diffs.

## Tests

- All new code must have tests.
- 100% coverage goal.
- Use mongodb-memory-server for DB tests.

## Ownership

- Follow CODEOWNERS for review assignments.

## Source of Truth

- Architecture.md defines canonical architecture decisions.
- Any changes to Architecture.md require review.
