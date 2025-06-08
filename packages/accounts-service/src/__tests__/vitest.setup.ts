import { expect } from 'vitest';
import { commonMatchers, graphqlMatchers, pactumMatchers } from './test-utils/matchers';

[
  commonMatchers,
  graphqlMatchers,
  pactumMatchers,
].forEach((matchers) => {
  expect.extend(matchers);
});