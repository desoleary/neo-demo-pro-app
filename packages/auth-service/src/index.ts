import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { users } from './data';
import { seed } from './seed';

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/user.graphql'), 'utf8')}
`;

const resolvers = {
  Query: {
    getUserProfile: (_: any, { id }: { id: string }) => users.find((u) => u.id === id),
    login: (_: any, { email, password }: { email: string; password: string }) =>
      users.find((u) => u.email === email && u.password === password),
  },
  Mutation: {
    updateUserTier: (_: any, { id, tier }: { id: string; tier: string }) => {
      const user = users.find((u) => u.id === id);
      if (user) user.tier = tier;
      return user;
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
      port: 4001,
      host: '0.0.0.0',
    },
  });

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/user.graphql'), 'utf8');
  console.log(`🚀 auth-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

start().catch((error) => {
  console.error('Failed to start auth-service:', error);
  process.exit(1);
});
