import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { createObservabilityPlugins } from '@neo-rewards/skeleton/src/observabilityHooks';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'accounts-service', url: 'http://localhost:4001/graphql' },
    { name: 'auth-service', url: 'http://localhost:4002/graphql' },
    { name: 'rewards-service', url: 'http://localhost:4003/graphql' },
    { name: 'transfers-service', url: 'http://localhost:4004/graphql' },
  ],
});

export async function createApp() {
  const server = new ApolloServer({
    gateway,
    plugins: createObservabilityPlugins(),
  });
  await server.start();
  const app = express();
  app.use('/graphql', express.json(), expressMiddleware(server));
  return app;
}

if (require.main === module) {
  createApp().then((app) => {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    app.listen(port, () => {
      console.log(`gateway listening on ${port}`);
    });
  });
}
