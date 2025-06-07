# CODEGEN.md

## Policy

- All GraphQL codegen output must be committed to the repo.
- This ensures AI tools and PR reviewers can reason about the API.

## Client

- Client codegen generates:
  - React Apollo hooks
  - TypeScript types

## Services

- Each service generates:
  - Resolver types from local schema

## Validation

- CI step checks codegen output is up to date.
- Developers must run:

```bash
pnpm turbo run generate
```

before committing API changes.

## Target Directories

- Client: `client/src/graphql/generated/`
- Services: `packages/*/src/graphql/types.generated.ts`
