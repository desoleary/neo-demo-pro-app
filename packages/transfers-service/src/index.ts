import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { readFileSync } from 'fs';
import { join } from 'path';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { Transfer, TransferResult, transfers } from './data';
import { seed } from './seed';

const typeDefs = gql`
  ${readFileSync(join(__dirname, 'graphql/schema/transfer.graphql'), 'utf8')}
`;

// Add a resolver for the Transfer type to handle the _id field
const transferResolvers = {
  Transfer: {
    _id: (parent: any) => parent.id,
  },
};

const resolvers = {
  ...transferResolvers,
  Query: {
    node: (_: any, { id }: { id: string }) => {
      // This is a simple implementation - in a real app, you'd need to handle different node types
      return transfers.find(transfer => transfer.id === id);
    },
    transfers: (
      _: any,
      { 
        first,
        after,
        last,
        before,
        filter,
        orderBy = { field: 'createdAt', order: 'DESC' }
      }: {
        first?: number,
        after?: string,
        last?: number,
        before?: string,
        filter?: any,
        orderBy?: { 
          field: string, 
          order: 'ASC' | 'DESC',
          direction?: 'ASC' | 'DESC' // For backward compatibility
        }
      }
    ) => {
      // Start with all transfers
      let result = [...transfers];
      
      // Apply filters
      if (filter) {
        result = result.filter(transfer => {
          if (filter.fromAccountId && transfer.fromAccountId !== filter.fromAccountId) return false;
          if (filter.toAccountId && transfer.toAccountId !== filter.toAccountId) return false;
          if (filter.status && transfer.status !== filter.status) return false;
          if (filter.minAmount !== undefined && transfer.amount < filter.minAmount) return false;
          if (filter.maxAmount !== undefined && transfer.amount > filter.maxAmount) return false;
          if (filter.startDate && new Date(transfer.createdAt) < new Date(filter.startDate)) return false;
          return !(filter.endDate && new Date(transfer.createdAt) > new Date(filter.endDate));

        });
      }

      // Apply sorting
      if (orderBy) {
        const { field, order, direction } = orderBy;
        // Use direction if provided, otherwise fall back to order
        const sortOrder = direction || order || 'ASC';
        
        result.sort((a: any, b: any) => {
          let comparison = 0;
          // Handle _id field mapping to id
          const aValue = field === '_id' ? a.id : a[field];
          const bValue = field === '_id' ? b.id : b[field];
          
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;
          return sortOrder === 'DESC' ? -comparison : comparison;
        });
      }

      // For cursor-based pagination, we'll use the index as the cursor for simplicity
      // In a real app, you'd want to use an actual cursor like base64 encoded string
      const edges = result.map((node, index) => ({
        node,
        cursor: Buffer.from(index.toString()).toString('base64')
      }));

      // Apply cursor pagination
      let startIndex = 0;
      let endIndex = edges.length;
      
      if (after) {
        const afterIndex = edges.findIndex(edge => edge.cursor === after);
        if (afterIndex !== -1) {
          startIndex = afterIndex + 1;
        }
      }
      
      if (before) {
        const beforeIndex = edges.findIndex(edge => edge.cursor === before);
        if (beforeIndex !== -1) {
          endIndex = beforeIndex;
        }
      }
      
      // Apply first/last limits
      if (first !== undefined) {
        endIndex = Math.min(endIndex, startIndex + first);
      } else if (last !== undefined) {
        startIndex = Math.max(startIndex, endIndex - last);
      }
      
      const paginatedEdges = edges.slice(startIndex, endIndex);
      const hasNextPage = endIndex < edges.length;
      const hasPreviousPage = startIndex > 0;
      
      return {
        edges: paginatedEdges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: paginatedEdges[0]?.cursor || null,
          endCursor: paginatedEdges[paginatedEdges.length - 1]?.cursor || null
        },
        totalCount: result.length
      };
    },
    transfer: (_: any, { id }: { id: string }) => {
      return transfers.find(t => t.id === id);
    },
  },
  Mutation: {
    initiateTransfer: (
      _: any,
      { fromAccountId, toAccountId, amount }: { fromAccountId: string; toAccountId: string; amount: number }
    ) => {
      const now = new Date().toISOString();
      const transfer: Transfer = {
        id: uuidv4(),
        fromAccountId,
        toAccountId,
        amount,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      };
      transfers.push(transfer);
      
      // Simulate async processing
      setTimeout(() => {
        const transferIndex = transfers.findIndex(t => t.id === transfer.id);
        if (transferIndex !== -1) {
          transfers[transferIndex] = {
            ...transfers[transferIndex],
            status: 'COMPLETED',
            updatedAt: new Date().toISOString(),
          } as Transfer;
        }
      }, 1000);
      
      const result: TransferResult = {
        id: transfer.id,
        status: transfer.status,
      };
      return result;
    },
  },
};

async function start() {
  await seed();
  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const server = new ApolloServer({
    schema,
    plugins: [createObservabilityPlugins()],
  });

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4004,
      host: '0.0.0.0',
    },
  });

  const schemaContent = readFileSync(join(__dirname, 'graphql/schema/transfer.graphql'), 'utf8');
  console.log(`🚀 transfers-service ready at ${url}`);
  console.log(`📄 Schema loaded with ${schemaContent.split('\n').length} lines`);
}

start().catch((error) => {
  console.error('Failed to start transfers-service:', error);
  process.exit(1);
});
