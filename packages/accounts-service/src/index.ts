import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import mongoose, { connection, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import AccountModel from './models/Account';
import TransactionModel from './models/Transaction';
import { seed } from './seed';

dotenv.config();

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/account.graphql'), 'utf8')}
`;

// Shared function to handle both accounts and getUserAccounts resolvers
async function resolveGetUserAccounts(
  _: any,
  { 
    userId, 
    first,
    after,
    last,
    before,
    filter = {},
    orderBy = { field: 'id', order: 'ASC' }
  }: {
    userId: string,
    first?: number,
    after?: string,
    last?: number,
    before?: string,
    filter?: {
      type?: string,
      minBalance?: number,
      maxBalance?: number
    },
    orderBy?: {
      field: string,
      order: 'ASC' | 'DESC',
      direction?: 'ASC' | 'DESC'
    }
  }
) {
  // Build the base query - handle both string and number user IDs
  const query: any = { 
    $or: [
      { userId: userId },
      { userId: typeof userId === 'string' ? parseInt(userId, 10) : userId }
    ].filter(Boolean)
  };
  console.log('Base query:', JSON.stringify(query, null, 2));
  
  // Apply filters if provided
  if (filter) {
    console.log('Applying filters:', JSON.stringify(filter, null, 2));
    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.minBalance !== undefined || filter.maxBalance !== undefined) {
      query.balance = {};
      if (filter.minBalance !== undefined) {
        query.balance.$gte = filter.minBalance;
      }
      if (filter.maxBalance !== undefined) {
        query.balance.$lte = filter.maxBalance;
      }
    }
  }
  
  console.log('Final query:', JSON.stringify(query, null, 2));

  // Get total count for pagination
  const totalCount = await AccountModel.countDocuments(query);

  // Build the query
  let accountsQuery = AccountModel.find(query);

  // Handle cursor-based pagination using _id for MongoDB
  if (after) {
    accountsQuery = accountsQuery.gt('_id', new mongoose.Types.ObjectId(after));
  } else if (before) {
    accountsQuery = accountsQuery.lt('_id', new mongoose.Types.ObjectId(before));
  }

  // Apply sorting based on orderBy
  if (orderBy) {
    const { field, order, direction } = orderBy;
    const sortOrder = order || direction || 'ASC';
    const sortDirection = sortOrder === 'DESC' ? -1 : 1;
    // Map 'id' to '_id' for MongoDB
    const mongoField = field === 'id' ? '_id' : field;
    accountsQuery = accountsQuery.sort({ [mongoField]: sortDirection });
  }

  // Apply limit
  if (first) {
    accountsQuery = accountsQuery.limit(first);
  } else if (last) {
    accountsQuery = accountsQuery.limit(last);
  }

  const accounts = await accountsQuery.exec();

  // Create edges with cursors and map _id to id
  const edges = accounts.map(account => {
    const accountObj = account.toObject();
    // Map _id to id for GraphQL
    const { _id, ...rest } = accountObj;
    return {
      node: {
        ...rest,
        id: _id.toString(),
        _id: _id.toString() // Include _id for backward compatibility
      },
      cursor: _id.toString(),
    };
  });

  // Determine page info
  const hasNextPage = accounts.length > 0 && 
    (await AccountModel.countDocuments({ 
      ...query, 
      _id: { $gt: accounts[accounts.length - 1]._id } 
    })) > 0;
  
  const hasPreviousPage = accounts.length > 0 && 
    (await AccountModel.countDocuments({ 
      ...query, 
      _id: { $lt: accounts[0]._id } 
    })) > 0;

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
    },
    totalCount,
  };
}

const resolvers = {
  Query: {
    accounts: resolveGetUserAccounts,
    getUserAccounts: resolveGetUserAccounts,
    getTransactionHistory: (_: any, { accountId }: { accountId: string }) =>
      TransactionModel.find({ accountId }).exec(),
  },
};

async function start() {
  // Force the correct database name regardless of MONGO_URL
  const mongoUrl = 'mongodb://localhost:27017/neo_demo_pro_app_accounts';
  console.log('Using MongoDB URL:', mongoUrl);
  console.log('Connecting to MongoDB with URL:', mongoUrl);
  
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
    
    // Get the native MongoDB driver connection
    const db = mongoose.connection.db;
    if (db) {
      console.log('MongoDB connection state:', mongoose.connection.readyState);
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections);
      
      // Log the first few accounts to verify data
      const accounts = await db.collection('accounts').find({}).limit(3).toArray();
      console.log('Sample accounts:', accounts);
    } else {
      console.error('MongoDB database reference not available');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
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
