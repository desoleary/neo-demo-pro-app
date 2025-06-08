import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/User';
import { seed } from './seed';

dotenv.config();

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/user.graphql'), 'utf8')}
`;

const resolvers = {
  User: {
    accounts: async (parent: any) => {
      // This is a stub - in a real app, this would fetch accounts for the user
      return [];
    }
  },
  Query: {
    users: async (
      _: any, 
      { 
        first = 10, 
        after, 
        filter = {},
        orderBy = { field: 'id', order: 'ASC' }
      }: { 
        first?: number, 
        after?: string,
        filter?: { id?: string, email?: string, tier?: string },
        orderBy?: { field: string, order: 'ASC' | 'DESC' }
      }
    ) => {
      const query: any = {};
      
      // Apply filters
      if (filter.id) query.id = filter.id;
      if (filter.email) query.email = filter.email;
      if (filter.tier) query.tier = filter.tier;
      
      // Handle cursor-based pagination
      if (after) {
        query._id = { $gt: after };
      }
      
      // Build sort object
      const sort: any = {};
      const sortField = orderBy?.field || 'id';
      const sortOrder = orderBy?.order === 'DESC' ? -1 : 1;
      sort[sortField] = sortOrder;
      
      // Execute query
      const users = await UserModel.find(query)
        .sort(sort)
        .limit(first + 1) // Fetch one extra to check for next page
        .lean();
      
      const hasNextPage = users.length > first;
      const items = hasNextPage ? users.slice(0, -1) : users;
      
      return {
        edges: items.map(user => ({
          node: user,
          cursor: user._id.toString(),
          __typename: 'UserEdge'
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false, // Not implemented for simplicity
          startCursor: items[0]?._id.toString(),
          endCursor: items[items.length - 1]?._id.toString(),
          __typename: 'PageInfo'
        },
        totalCount: await UserModel.countDocuments(query),
        __typename: 'UserConnection'
      };
    },
    getUserProfile: async (_: any, { id }: { id: string }) => {
      return UserModel.findOne({ id }).lean();
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      return UserModel.findOne({ email, password }).lean();
    },
  },
  Mutation: {
    updateUserTier: async (_: any, { id, tier }: { id: string; tier: string }) => {
      return UserModel.findOneAndUpdate(
        { id },
        { $set: { tier } },
        { new: true }
      ).lean();
    },
  },
};

async function start() {
  // Connect to MongoDB
  const mongoUrl = 'mongodb://localhost:27017/neo_demo_pro_app';
  console.log('Connecting to MongoDB at:', mongoUrl);
  
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }

  // Seed data if in development
  if (process.env.NODE_ENV === 'development') {
    await seed();
  }

  // Build and start the Apollo Server
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
