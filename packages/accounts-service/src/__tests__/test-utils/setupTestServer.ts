import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import resolvers from '@gql-resolvers';
import type { GraphQLFormattedError } from 'graphql';

export function createTestServer() {
  // Load and merge all .graphql files
  const typeDefsArray = loadFilesSync(path.join(__dirname, '../../graphql/schemas/**/*.graphql'));
  const typeDefs = mergeTypeDefs(typeDefsArray);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });

  async function execute<TData = any>(
    operation: string,
    variables?: Record<string, any>
  ): Promise<{
    data: TData;
    errors?: readonly GraphQLFormattedError[];
    fullResponse: Awaited<ReturnType<typeof server.executeOperation>>;
  }> {
    const fullResponse = await server.executeOperation({
      query: operation,
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
  }

  return {
    server,

    query: <TData = any>(query: string, variables?: Record<string, any>) =>
      execute<TData>(query, variables),

    mutate: <TData = any>(mutation: string, variables?: Record<string, any>) =>
      execute<TData>(mutation, variables),
  };
}