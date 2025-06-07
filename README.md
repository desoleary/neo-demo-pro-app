# Neo Rewards Demo Monorepo

This is the main monorepo for the Neo Rewards Demo project.

The goal is to showcase a **modular, scalable architecture** for a customer-facing banking rewards app, aligned with modern Neo-style architecture patterns:

- Web / mobile rewards and loyalty
- Federated GraphQL API surface
- Composable microservices approach
- AI/Codex-friendly conventions
- Mentoring-ready structure

---

## Architecture

- Monorepo managed with **pnpm** + **TurboRepo**
- Apollo Federation v2 → Gateway + Subgraph services
- Single MongoDB instance for demo scope
- React + Vite client
- Shared Skeleton package for cross-cutting concerns

**Full architecture reference:** [Architecture.md](./Architecture.md)

---

## Monorepo Structure

```
packages/
  skeleton/
  gateway/
  accounts-service/
  auth-service/
  rewards-service/
  transfers-service/

client/

.github/workflows/ci.yml
turbo.json
pnpm-workspace.yaml
```

---

## Development

### Install dependencies

```bash
pnpm install
```

### Run dev

```bash
pnpm turbo run dev
```

### Run lint

```bash
pnpm turbo run lint
```

### Run test

```bash
pnpm turbo run test
```

### Run build

```bash
pnpm turbo run build
```

---

## Codegen

- GraphQL codegen is used in both client and services.
- **Generated types/hooks are committed to repo** → see [CODEGEN.md](./CODEGEN.md).

---

## Commit Hygiene

- Pre-commit checks:
  - lint-staged
  - commitlint
  - Conventional Commits enforced

→ See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## CI/CD

GitHub Actions CI runs on PRs and pushes to main:

- Lint
- Test
- Build
- Codegen validation

---

## Ownership

Ownership is defined via [CODEOWNERS](./.github/CODEOWNERS).

---

## Observability

- Tracing via Apollo plugins
- Structured logging
- Observability hooks in Skeleton package

---

## AI Friendliness

Architecture is designed to be AI/Codex-friendly:

- Clear directory structure
- Committed codegen
- Architecture.md as source of truth

---

## Status

🚀 Initial scaffold in progress  
✅ Gateway and Skeleton established  
✅ CI/CD in place  
⬜ Client scaffold next  
⬜ Additional services to be added  
⬜ 100% test coverage target in progress  

---

Maintainer: [Your Name or GitHub handle]
