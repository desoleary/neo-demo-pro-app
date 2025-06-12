import { expect } from 'vitest';
import { toMatchPactumMatcher } from './pactum-matchers';

expect.extend({ toMatchPactumMatcher });

describe('toMatchPactumMatcher', () => {
  it('should pass when objects match', () => {
    expect({ foo: 'bar' }).toMatchPactumMatcher({ foo: 'bar' });
  });

  it('should fail when objects do not match', () => {
    expect(() => {
      expect({ foo: 'bar' }).toMatchPactumMatcher({ foo: 'baz' });
    }).toThrowError(/expected Pactum response to match/);
  });
});