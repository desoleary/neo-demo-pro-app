
# `@neo-rewards/accounts-service`

[![Node](https://img.shields.io/badge/node-22.x-brightgreen.svg)](https://nodejs.org/en/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange.svg)](https://pnpm.io/)
[![Apollo Subgraph](https://img.shields.io/badge/apollo--subgraph-v2-blue.svg)](https://www.apollographql.com/docs/federation/)

A **GraphQL Subgraph** for managing **Accounts** and **Transactions** in the [Neo Rewards Demo App](https://github.com/your-org/neo-rewards-demo-app) federated architecture.

---

## Features

✅ `Query.getUserAccounts`  
✅ `Query.getTransactionHistory`  
✅ **Account** model  
✅ **Transaction** model  
✅ GraphQL Federation v2 support via `@apollo/subgraph`  
✅ Authoritative schema in `src/graphql/schema/**/*.graphql`  
✅ Generated artifact in `schema.graphql`  
✅ Seed script (`src/seed.ts`) for populating dev/test data  
✅ Unit tests via Vitest  
✅ Shared observability plugins support

---

## Project Structure

```
@neo-rewards/accounts-service/
├── schema.graphql               # Generated schema artifact (via generate-schema)
├── src/
│   ├── graphql/schema/          # GraphQL SDL schema definitions
│   ├── models/                  # Mongoose models (Account, Transaction)
│   ├── seed.ts                  # Seed script
│   ├── index.ts                 # Subgraph entrypoint (ApolloServer config)
│   ├── types.ts                 # Local TypeScript types
│   └── __factories__/           # Test factories
├── __tests__/                   # Vitest tests + test utils
├── package.json                 # Subgraph package definition
└── README.md                    # This file
```

---

## Scripts

### Build

```bash
pnpm build
```

- Compiles TypeScript
- Generates `schema.graphql`

### Dev

```bash
pnpm dev
```

- Runs the subgraph in watch mode

### Generate Schema

```bash
pnpm generate-schema
```

- Outputs the GraphQL schema to `schema.graphql` (used by CI and Gateway)

### Seed Data

```bash
pnpm seed
```

- Runs `src/seed.ts` to populate dev/test data (MongoDB required)

### Tests

```bash
pnpm test
```

- Runs Vitest unit tests

---

## Observability

This service supports pluggable observability via:

```ts
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
```

- Logs, tracing, and metrics can be attached via Apollo Server plugins.

---

## Notes

- The schema in `schema.graphql` is an artifact used for CI validation and Gateway federation — it is generated, do not edit manually.
- The authoritative schema lives in `src/graphql/schema/**/*.graphql`.
- Seed script is used in local dev and CI pipelines.

---

## Onboarding Checklist

✅ Install dependencies:
```bash
pnpm install
```

✅ Build and generate schema:
```bash
pnpm build
```

✅ Run dev mode:
```bash
pnpm dev
```

✅ Seed data:
```bash
pnpm seed
```

✅ Run tests:
```bash
pnpm test
```

---

## License

MIT (example — adjust as needed for your org)
