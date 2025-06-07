# Architecture.md

## Overview

This project demonstrates a modular, scalable architecture for a customer-facing banking rewards app, aligned with Neo-style domains:

- Web / mobile rewards and loyalty
- Federated GraphQL API surface
- Composable microservices
- Monorepo managed with pnpm + TurboRepo
- Single MongoDB instance (demo scope)

---

## Monorepo Structure

- Workspace manager: pnpm
- Build orchestration: TurboRepo
- Workspaces:
  - skeleton
  - gateway
  - accounts-service
  - auth-service
  - rewards-service
  - transfers-service
  - client

---

## GraphQL Architecture

- Pattern: Apollo Federation v2
- Gateway: Apollo Gateway (static URLs in dev)
- Services: Apollo Server v4 + @apollo/subgraph
- Schema evolution:
  - @deprecated used where applicable
  - CI tests for deprecated fields
- Schema conventions:
  - Cursor-based pagination
  - Ordering, filtering patterns
  - Strict identifier field patterns

---

## Codegen

- Codegen is committed.
- Client:
  - Generates React Apollo hooks from Gateway schema.
- Services:
  - Generates resolver types from local schema.

---

## Testing

- mongodb-memory-server
- Test lifecycle helpers in Skeleton
- CI enforces NODE_ENV=test
- Target: 100% test coverage

---

## Observability

- Apollo plugins: Tracing, logging
- Skeleton provides observability hooks.

---

## Commit Hygiene & CI/CD

- CI runs on push and PR:
  - Lint, test, build, codegen validation
- Commit hygiene:
  - lint-staged
  - commitlint
  - Conventional Commits

---

## Ownership

- CODEOWNERS used for ownership boundaries.

---

## AI Friendliness

- Committed codegen
- Architecture.md as source of truth
- CONTRIBUTING.md and CODEGEN.md as supporting policies

---

## Future Improvements

- Turbo remote cache
- Distributed tracing
- Schema versioning

---

*For full details, see pnpm-workspace.yaml and turbo.json.*
