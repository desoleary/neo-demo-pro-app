import { expect } from 'vitest';
import { commonMatchers, graphqlMatchers, pactumMatchers } from '@test-utils/matchers';

expect.extend({
  ...commonMatchers,
  ...graphqlMatchers,
  ...pactumMatchers,
});