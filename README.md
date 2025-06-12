
# Neo Rewards Demo App

[![CI](https://github.com/your-org/neo-rewards-demo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/neo-rewards-demo-app/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-22.x-brightgreen.svg)](https://nodejs.org/en/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-orange.svg)](https://pnpm.io/)
[![Apollo Federation](https://img.shields.io/badge/apollo--federation-v2-blue.svg)](https://www.apollographql.com/docs/federation/)

A modular **GraphQL Federation Demo App** inspired by Neo Financial architecture patterns.  
Designed to showcase **user-facing microservices**, **rewards**, **accounts**, **transfers**, and a federated **gateway**.

---

## Architecture

```
neo-rewards-demo-app/
├── packages/
│   ├── accounts-service/      # Subgraph for Accounts
│   ├── auth-service/          # Subgraph for Users/Auth
│   ├── rewards-service/       # Subgraph for Rewards
│   ├── transfers-service/     # Subgraph for Transfers
│   ├── gateway/               # Apollo Gateway (dynamic)
│   ├── skeleton/              # Shared utilities (e.g. generate-schema CLI, observability plugins)
├── client/                    # React client (Vite, Tailwind)
├── .github/workflows/         # CI workflows
├── package.json               # Root workspace + build/test orchestration
└── pnpm-lock.yaml             # Monorepo lockfile
```

---

## Key Concepts

✅ **GraphQL Federation** via `@apollo/subgraph`  
✅ Each service defines:
- `src/graphql/schema/**/*.graphql` → authoritative schema source
- `schema.graphql` → build artifact (generated via CLI)

✅ **CI Validates Federation**:
- `pnpm generate-schemas` → generates `schema.graphql` for each subgraph
- `actions/upload-artifact` → archives schemas for diffing and validation

✅ Gateway:
- currently uses **dynamic introspection** → live subgraph schemas
- ready to support **Static Supergraph SDL** if needed in future.

✅ Observability:
- Shared `createObservabilityPlugins` provided by `@neo-rewards/skeleton`
- Each service may use this in ApolloServer config.

✅ Seed:
- `pnpm seed` runs each service's `seed` script (`ts-node src/seed.ts`)
- All services support `seed` to populate dev/test data.

✅ Shared CLI:
- `@neo-rewards/skeleton` provides `generate-schema` CLI used in each service.

✅ Client:
- React + Vite + Tailwind
- Uses `@apollo/client`
- Uses `@rjsf` (React JSONSchema Form) for dynamic forms

---

## Build & Dev Flow

### Monorepo Build

```bash
pnpm build
```

Each service:
- `tsc`
- `pnpm generate-schema` → emits `schema.graphql`

Gateway introspects live subgraphs.

### Dev Mode

```bash
pnpm dev
```

Runs in parallel:
- Services
- Gateway
- Client

### Seed Data

```bash
pnpm seed
```

Seeds each service via its `seed` script.

---

## GraphQL Schema Generation

Each subgraph service has:

```json
"scripts": {
  "generate-schema": "generate-schema 'src/graphql/schema/**/*.graphql' './schema.graphql'",
  "build": "tsc && pnpm generate-schema",
}
```

- `schema.graphql` is generated on every build.
- Used for **CI validation** and optionally for **Gateway static mode**.

---

## CI

GitHub Workflows:

### `.github/workflows/ci.yml`

- On `main` push:
  - Install dependencies
  - Lint
  - Test
  - Build
  - Upload `schema.graphql` from each subgraph

### `.github/workflows/ci-pr.yml`

- On PR:
  - Install
  - Lint
  - Test
  - (no schema upload — for speed)

---

## Notes on Schema Usage

- `src/graphql/schema/**/*.graphql` → authoritative source, consumed at runtime:
  - via `readFileSync` in `src/index.ts`
- `schema.graphql` → artifact for tooling / CI / federation checks:
  - Not consumed at runtime currently (correct pattern).
  - Ready for future `rover compose` flow if static Gateway desired.

---

## Suggested `federation:check` Script

```json
"scripts": {
  "federation:check": "pnpm generate-schemas && echo 'Run federation checks here (e.g. rover supergraph compose)'"
}
```

For future:
- Use Apollo **Rover CLI**:
```bash
rover supergraph compose --config supergraph-config.yaml > supergraph.graphql
```

---

## Developer Onboarding Checklist

✅ Install [pnpm](https://pnpm.io/) version `10.x`  
✅ Node.js `>=22.10.0`  
✅ Clone repo and run:
```bash
pnpm install
pnpm build
pnpm dev
```

✅ Explore the system:
- Client UI → `http://localhost:3000` (default Vite)
- Gateway → `http://localhost:4000/graphql`
- Services → ports `4001`, `4002`, `4003`, `4004`

✅ Validate schemas:
```bash
pnpm generate-schemas
```

✅ Run tests:
```bash
pnpm test:all
```

✅ Run CI locally (simulate GitHub Actions):
```bash
pnpm ci:all
```

---

## Summary

This project implements a **federated, CI-validated architecture** aligned with modern best practices:

- Small clean subgraphs
- Unified Gateway
- Schema generation + CI validation
- Shared utilities via `@neo-rewards/skeleton`
- Seedable services
- Scalable for future growth
