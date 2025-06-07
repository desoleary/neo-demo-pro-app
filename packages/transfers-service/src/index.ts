import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { transfers } from './data';
import { seed } from './seed';

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/transfer.graphql'), 'utf8')}
`;

const resolvers = {
  Mutation: {
    initiateTransfer: (
      _: any,
      { fromAccountId, toAccountId, amount }: { fromAccountId: string; toAccountId: string; amount: number }
    ) => {
      const result = {
        id: String(transfers.length + 1),
        status: 'SUCCESS',
      };
      transfers.push(result);
      return result;
    },
  },
};

async function start() {
  await seed();
  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({
    schema,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4004,
      host: '0.0.0.0',
    },
  });

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/transfer.graphql'), 'utf8');
  console.log(`🚀 transfers-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

start().catch((error) => {
  console.error('Failed to start transfers-service:', error);
  process.exit(1);
});
