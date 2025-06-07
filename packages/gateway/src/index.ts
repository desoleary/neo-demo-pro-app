import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth-service', url: 'http://localhost:4001/graphql' },
      { name: 'accounts-service', url: 'http://localhost:4002/graphql' },
      { name: 'rewards-service', url: 'http://localhost:4003/graphql' },
      { name: 'transfers-service', url: 'http://localhost:4004/graphql' },
    ],
  }),
});

async function start() {
  const server = new ApolloServer({
    gateway,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`gateway ready at ${url}`);
}

start();
