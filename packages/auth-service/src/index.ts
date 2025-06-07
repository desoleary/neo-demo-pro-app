import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';

const typeDefs = readFileSync(join(__dirname, 'graphql/schema/user.graphql'), 'utf8');

const resolvers = {};

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
  console.log(`auth-service ready at ${url}`);
}

start();
