# neo-rewards-demo-app

This repository contains a reference architecture for a GraphQL federation demo using multiple microservices. Each service is written in TypeScript and shares common utilities from the `@neo-rewards/skeleton` package.

## Packages
- `auth-service`
- `accounts-service`
- `rewards-service`
- `transfers-service`
- `gateway`
- `skeleton`
- `client` (React + Apollo Client)

## Development
Install dependencies and build all packages using pnpm.

```bash
pnpm install
pnpm build
```

Run services individually from their package directories using `pnpm dev`.
