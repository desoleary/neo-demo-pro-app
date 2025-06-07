import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { seed } from './seed';
import { connect, Types, Document, Connection, connection } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import RewardModel from './models/Reward';

// Extend the IReward interface to include the _id field
export interface IReward extends Document {
  _id: Types.ObjectId;
  id: string;
  description: string;
  points: number;
  redeemed: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // Add index signature to allow any additional properties
  __v?: number; // Add __v field for mongoose versioning
}

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/reward.graphql'), 'utf8')}
`;

// Resolvers for the Reward type
const rewardResolvers = {
  Reward: {
    _id: (parent: any) => parent.id,
  },
  Query: {
    rewards: async (
      _: any,
      { 
        first,
        after,
        last,
        before,
        filter = {},
        orderBy = { field: 'points', order: 'ASC' }
      }: {
        first?: number,
        after?: string,
        last?: number,
        before?: string,
        filter?: { minPoints?: number, maxPoints?: number, search?: string },
        orderBy?: { field: string, order: 'ASC' | 'DESC', direction?: 'ASC' | 'DESC' }
      }
    ) => {
      // Build the query
      const query: any = {};
      
      // Apply filters
      if (filter) {
        if (filter.minPoints !== undefined) {
          query.points = { ...query.points, $gte: filter.minPoints };
        }
        if (filter.maxPoints !== undefined) {
          query.points = { ...query.points, $lte: filter.maxPoints };
        }
        if (filter.search) {
          query.description = { $regex: filter.search, $options: 'i' };
        }
      }

      // Build sort object with proper type handling
      const sortField = orderBy.field === '_id' ? '_id' : orderBy.field;
      const sortOrder = orderBy.direction || orderBy.order || 'ASC';
      const sort: Record<string, 1 | -1> = { [sortField]: sortOrder === 'ASC' ? 1 : -1 };
      
      // Build the base query with cursor conditions
      const mongoQuery = { ...query };
      
      // Apply cursor-based pagination with proper type handling
      if (after) {
        const afterId = Buffer.from(after, 'base64').toString('utf-8');
        mongoQuery._id = { ...mongoQuery._id, $gt: new Types.ObjectId(afterId) };
      } else if (before) {
        const beforeId = Buffer.from(before, 'base64').toString('utf-8');
        mongoQuery._id = { ...mongoQuery._id, $lt: new Types.ObjectId(beforeId) };
      }
      
      // Get total count for pagination info
      const totalCount = await RewardModel.countDocuments(mongoQuery);
      
      // Build the query with sort and limit
      let queryBuilder = RewardModel.find(mongoQuery).sort(sort);
      
      // Apply first/last limits with proper type handling
      const limit = first !== undefined && first !== null ? Number(first) : 
                   last !== undefined && last !== null ? Number(last) : undefined;
      
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }
      
      const rewards = await queryBuilder.lean<IReward[]>();
      
      // Create edges with cursors
      const edges = rewards.map(reward => {
        const cursor = Buffer.from(reward._id.toString()).toString('base64');
        return {
          node: {
            id: reward._id.toString(),
            _id: reward._id.toString(),
            description: reward.description,
            points: reward.points,
            redeemed: reward.redeemed,
            __typename: 'Reward' as const
          },
          cursor
        };
      });
      
      // Determine pagination info
      let hasNextPage = false;
      if (rewards.length > 0) {
        const lastReward = rewards[rewards.length - 1];
        const nextPageQuery = { ...query } as any;
        nextPageQuery._id = { $gt: lastReward._id };
        hasNextPage = await RewardModel.countDocuments(nextPageQuery) > 0;
      }
      
      const hasPreviousPage = !!(rewards.length > 0 && after);
      
      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null
        },
        totalCount
      };
    },
    reward: async (_: any, { id }: { id: string }) => {
      try {
        const reward = await RewardModel.findOne({ id }).lean();
        if (!reward) return null;
        
        return {
          ...reward,
          _id: reward._id.toString(),
          id: reward._id.toString(),
          __typename: 'Reward' as const
        };
      } catch (error) {
        console.error('Error fetching reward:', error);
        return null;
      }
    },
  },
  Mutation: {
    redeemReward: async (_: any, { id }: { id: string }) => {
      try {
        const reward = await RewardModel.findOneAndUpdate(
          { id },
          { $set: { redeemed: true, updatedAt: new Date() } },
          { new: true, lean: true }
        );
        
        if (!reward) return null;
        
        return {
          ...reward,
          _id: reward._id.toString(),
          id: reward._id.toString(),
          __typename: 'Reward' as const
        };
      } catch (error) {
        console.error('Error redeeming reward:', error);
        return null;
      }
    },
  },
};

const resolvers = {
  ...rewardResolvers,
};

async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await connect(process.env.MONGO_URL as string, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Seed the database if needed
    try {
      const count = await RewardModel.countDocuments();
      if (count === 0) {
        console.log('No rewards found in database. Seeding...');
        await seed();
      } else {
        console.log(`Found ${count} existing rewards in database`);
      }
    } catch (error) {
      console.error('Error checking/creating seed data:', error);
      throw error;
    }
    
    return conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function start() {
  // Connect to MongoDB first
  await connectToDatabase();
  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({
    schema,
    plugins: [createObservabilityPlugins()],
    // Enable introspection and playground in development
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4003,
      host: '0.0.0.0',
    },
  });

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/reward.graphql'), 'utf8');
  console.log(`🚀 rewards-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await connection.close();
  process.exit(0);
});

start().catch((error) => {
  console.error('Failed to start rewards-service:', error);
  process.exit(1);
});
