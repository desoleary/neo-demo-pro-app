// packages/skeleton/src/utils/generateSchema.ts

import { buildSubgraphSchema, printSubgraphSchema } from '@apollo/subgraph';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { writeFileSync } from 'fs';
import path from 'path';

/**
 * Generates schema.graphql for a subgraph
 * @param options - configuration options
 */
export function generateSchema({
                                 schemaGlob = 'src/graphql/schema/**/*.graphql',
                                 outputPath = './schema.graphql',
                                 resolvers = {},
                               }: {
  schemaGlob?: string;
  outputPath?: string;
  resolvers?: any;
} = {}): void {
  console.log(`📄 Loading schema from: ${schemaGlob}`);

  const typeDefsArray = loadFilesSync(schemaGlob);
  const typeDefs = mergeTypeDefs(typeDefsArray);

  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

  const sdl = printSubgraphSchema(schema);

  const fullOutputPath = path.resolve(outputPath);
  writeFileSync(fullOutputPath, sdl);

  console.log(`✅ schema.graphql generated at ${fullOutputPath}`);
}