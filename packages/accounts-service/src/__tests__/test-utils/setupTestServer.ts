import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { join } from 'path';
import resolvers from '../../graphql/resolvers';
import type { GraphQLFormattedError } from 'graphql';

const typeDefs = gql`
    ${readFileSync(join(__dirname, '../../graphql/schema/account.graphql'), 'utf8')}
`;

export function createTestServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  return {
    server,

    async executeOperation(
      operation: Parameters<typeof server.executeOperation>[0]
    ) {
      return server.executeOperation(operation);
    },

    async query<TData = any>(
      query: string,
      variables?: Record<string, any>
    ): Promise<{
      data: TData;
      errors?: readonly GraphQLFormattedError[];
      fullResponse: Awaited<ReturnType<typeof server.executeOperation>>;
    }> {
      const fullResponse = await server.executeOperation({
        query,
        variables,
      });

      if (fullResponse.body.kind !== 'single') {
        throw new Error(`Expected single GraphQL response, got ${fullResponse.body.kind}`);
      }

      return {
        data: fullResponse.body.singleResult.data as TData,
        errors: fullResponse.body.singleResult.errors,
        fullResponse,
      };
    },

    async mutate<TData = any>(
      mutation: string,
      variables?: Record<string, any>
    ): Promise<{
      data: TData;
      errors?: readonly GraphQLFormattedError[];
      fullResponse: Awaited<ReturnType<typeof server.executeOperation>>;
    }> {
      const fullResponse = await server.executeOperation({
        query: mutation,
        variables,
      });

      if (fullResponse.body.kind !== 'single') {
        throw new Error(`Expected single GraphQL response, got ${fullResponse.body.kind}`);
      }

      return {
        data: fullResponse.body.singleResult.data as TData,
        errors: fullResponse.body.singleResult.errors,
        fullResponse,
      };
    },
  };
}