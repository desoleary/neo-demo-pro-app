declare module 'vitest' {
  export interface Assertion<T = any> {
    toBeValidGraphQLResponse(): void;
    toBeEmpty(): void;
    toContainKey(key: string): void;
    toContainAllKeys(keys: string[]): void;
    toBeOneOf(values: any[]): void;
    toBeJsonString(): void;
    toMatchPactumMatcher(matcher: any): void;
    toEqualWithDiff(expected: any): void; // Add here too!
  }

  export interface AsymmetricMatchersContaining {
    toBeValidGraphQLResponse(): void;
    toBeEmpty(): void;
    toContainKey(key: string): void;
    toContainAllKeys(keys: string[]): void;
    toBeOneOf(values: any[]): void;
    toBeJsonString(): void;
    toBeJsonString(): void;
    toMatchPactumMatcher(matcher: any): void;
    toEqualWithDiff(expected: any): void; // Add here too!
  }
}

export interface MatcherContext {
  utils: {
    printReceived: (received: unknown) => string;
    printExpected: (expected: unknown) => string;
    matcherHint: (...args: any[]) => string;
    diff?: (a: unknown, b: unknown) => string | null;
  };
  equals: (a: unknown, b: unknown) => boolean;
  isNot: boolean;
}