# Auth Service

## API
- `Query.getUserProfile`
- `Query.login`
- `Mutation.updateUserTier`

## Architecture
Apollo Subgraph using MongoDB and Federation. Owns the `User` type.

## Development
```bash
pnpm install
pnpm dev
```

## Testing
```bash
pnpm install
pnpm test
```

## Production
Build with `pnpm build` and run `pnpm start`.
