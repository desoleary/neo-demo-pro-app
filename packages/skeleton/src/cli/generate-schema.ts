#!/usr/bin/env node

import { generateSchema } from '../utils';

const schemaGlob = process.argv[2] || 'src/graphql/schema/**/*.graphql';
const outputPath = process.argv[3] || './schema.graphql';

generateSchema({
  schemaGlob,
  outputPath,
});