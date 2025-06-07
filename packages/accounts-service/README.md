# Accounts Service

## API
- `Query.getUserAccounts`
- `Query.getTransactionHistory`

## Architecture
Extends the federated `User` type and owns `Account` and `Transaction`.

## Development
```bash
pnpm install
pnpm dev
```

## Testing
```bash
pnpm test
```

## Production
Build with `pnpm build` and run `pnpm start`.
