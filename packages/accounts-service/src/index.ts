import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import resolvers from './graphql/resolvers';
import { seed } from './seed';

dotenv.config();

// Load and merge GraphQL schemas dynamically
const typeDefsArray = loadFilesSync(path.join(__dirname, './graphql/schemas/**/*.graphql'));
const typeDefs = mergeTypeDefs(typeDefsArray);

async function start() {
  const mongoUrl = 'mongodb://localhost:27017/neo_demo_pro_app_accounts';
  console.log('Using MongoDB URL:', mongoUrl);

  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected.');

    if (process.env.NODE_ENV === 'development') {
      await seed();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({
    schema,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4002,
      host: '0.0.0.0',
    },
  });

  console.log(`🚀 accounts-service ready at ${url}`);
}

start().catch((error) => {
  console.error('Failed to start accounts-service:', error);
  process.exit(1);
});