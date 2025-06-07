import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AccountModel from './models/Account';
import TransactionModel from './models/Transaction';
import { seed } from './seed';

dotenv.config();

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/account.graphql'), 'utf8')}
`;

const resolvers = {
  Query: {
    getUserAccounts: (_: any, { userId }: { userId: string }) =>
      AccountModel.find({ userId }).exec(),
    getTransactionHistory: (_: any, { accountId }: { accountId: string }) =>
      TransactionModel.find({ accountId }).exec(),
  },
};

async function start() {
  await mongoose.connect(process.env.MONGO_URL as string);
  if (process.env.NODE_ENV === 'development') {
    await seed();
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

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/account.graphql'), 'utf8');
  console.log(`🚀 accounts-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

start().catch((error) => {
  console.error('Failed to start accounts-service:', error);
  process.exit(1);
});
