import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { rewards } from './data';
import { seed } from './seed';

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/reward.graphql'), 'utf8')}
`;

const resolvers = {
  Query: {
    getRewards: () => rewards,
  },
  Mutation: {
    redeemReward: (_: any, { id }: { id: string }) => rewards.find((r) => r.id === id),
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
      port: 4003,
      host: '0.0.0.0',
    },
  });

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/reward.graphql'), 'utf8');
  console.log(`🚀 rewards-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

start().catch((error) => {
  console.error('Failed to start rewards-service:', error);
  process.exit(1);
});
