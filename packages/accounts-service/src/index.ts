import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';

const typeDefs = readFileSync(join(__dirname, 'graphql/schema/account.graphql'), 'utf8');

const resolvers = {};

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
  console.log(`accounts-service ready at ${url}`);
}

start();
