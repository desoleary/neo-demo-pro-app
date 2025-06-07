# Neo Rewards Demo Monorepo

This repository hosts the **Neo Rewards Demo** project. It showcases a modular Apollo Federation architecture with a single MongoDB instance and a React client. The repo is designed to be Codex/AI friendly and mentoring ready.

## Architecture Overview

- **Apollo Federation v2** with an Apollo Gateway and federated subgraph services
- **Single MongoDB instance** for demo scope
- **React + Vite client** using Apollo Client with generated hooks
- **Shared skeleton package** providing configuration loaders, observability hooks, and utilities
- **pnpm** workspaces managed by **TurboRepo**

## Workspaces

- `packages/skeleton` – shared utilities and observability hooks
- `packages/gateway` – Apollo Gateway composing subgraphs
- `packages/accounts-service` – example federated service
- `packages/auth-service` – to be implemented
- `packages/rewards-service` – to be implemented
- `packages/transfers-service` – to be implemented
- `client` – React application

## Development

Use **pnpm** to install dependencies and **TurboRepo** to orchestrate builds. Each package can be built or started individually.

```bash
pnpm install
pnpm --filter @neo-rewards/gateway run dev
```

Docker Compose provides local MongoDB instances for development and testing.

## Code Generation

GraphQL code generation outputs are committed to the repository. Services generate local resolver types and the client generates React hooks from the gateway schema. See `CODEGEN.md` for details.

## Observability

Observability plugins (tracing and structured logging with correlation IDs) are provided via the skeleton package and used by both services and the gateway.

---

This README and the accompanying architecture YAML are the authoritative source of truth for project conventions.
