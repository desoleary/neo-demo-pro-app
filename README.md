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

## Testing
Install dependencies before running tests to ensure all packages and
their binaries are available.

```bash
pnpm install
pnpm test
```

Tests use `mongodb-memory-server` which downloads MongoDB binaries at run time.
The first run requires network access. If your environment cannot access the
download servers, supply prebuilt binaries using the `MONGOMS_DOWNLOAD_DIR`
environment variable.

## Dynamic UI Components

Example usage for `DynamicForm`:

```tsx
import { DynamicForm } from './src/components/DynamicForm';
import { userFormSchema } from './src/schemas/userFormSchema';

<DynamicForm schema={userFormSchema} onSubmit={console.log} />
```

Example usage for `DynamicTable`:

```tsx
import { DynamicTable } from './src/components/DynamicTable';
import { userTableColumns } from './src/schemas/userTableSchema';

<DynamicTable columns={userTableColumns} data={[{ id: '1', email: 'a@b.com', tier: 'gold' }]} />
```

Example usage for `DynamicChart`:

```tsx
import { DynamicChart } from './src/components/DynamicChart';
import { sampleChartConfig } from './src/schemas/chartConfig';

<DynamicChart config={sampleChartConfig} />
```

The Dashboard page composes these components via `DynamicLayout`.
