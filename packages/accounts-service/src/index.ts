import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import { MongoClient } from 'mongodb';
import express from 'express';
import { createObservabilityPlugins } from '@neo-rewards/skeleton/src/observabilityHooks';
import { createResolvers } from './graphql/resolvers/user';

const typeDefs = gql(readFileSync(path.join(__dirname, 'graphql/schema/user.graphql'), 'utf8'));

export async function createApp() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/accounts';
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db();

  const resolvers = createResolvers(db);
  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({
    schema,
    plugins: createObservabilityPlugins(),
  });
  await server.start();

  const app = express();
  app.use('/graphql', express.json(), expressMiddleware(server));
  return app;
}

if (require.main === module) {
  createApp().then((app) => {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4001;
    app.listen(port, () => {
      console.log(`accounts-service listening on ${port}`);
    });
  });
}
