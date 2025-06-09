import { expect } from 'vitest';
import { commonMatchers, graphqlMatchers, pactumMatchers } from './test-utils/matchers';

// Extend expect with common matchers
Object.entries(commonMatchers).forEach(([name, matcher]) => {
  (expect as any)[name] = matcher;
});

// Extend expect with GraphQL matchers
Object.entries(graphqlMatchers).forEach(([name, matcher]) => {
  (expect as any)[name] = matcher;
});

// Extend expect with Pactum matchers
Object.entries(pactumMatchers).forEach(([name, matcher]) => {
  (expect as any)[name] = matcher;
});