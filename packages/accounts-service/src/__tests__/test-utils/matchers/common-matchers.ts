import { isEmpty, has, includes, isString, isPlainObject, isArray } from 'lodash-es';
import { diff as jestDiff } from 'jest-diff';
import { equals } from '@vitest/expect';

export const toBeEmpty = (received: any) => {
  const pass = isEmpty(received);
  return {
    pass,
    message: () =>
      `expected ${JSON.stringify(received)} to ${pass ? 'not ' : ''}be empty`,
  };
};

export const toContainKey = (received: object, key: string) => {
  const pass = has(received, key);
  return {
    pass,
    message: () =>
      `expected object to ${pass ? 'not ' : ''}contain key "${key}"`,
  };
};

export const toContainAllKeys = (received: object, keys: string[]) => {
  const pass = keys.every((key) => has(received, key));
  return {
    pass,
    message: () =>
      `expected object to ${pass ? 'not ' : ''}contain all keys [${keys.join(', ')}]`,
  };
};

export const toBeOneOf = (received: any, values: any[]) => {
  const pass = includes(values, received);
  return {
    pass,
    message: () =>
      `expected ${JSON.stringify(received)} to ${pass ? 'not ' : ''}be one of [${values.map(v => JSON.stringify(v)).join(', ')}]`,
  };
};

export const toBeJsonString = (received: any) => {
  let parsed;
  let pass = false;
  if (isString(received)) {
    try {
      parsed = JSON.parse(received);
      pass = isPlainObject(parsed) || isArray(parsed);
    } catch {
      pass = false;
    }
  }
  return {
    pass,
    message: () =>
      `expected ${JSON.stringify(received)} to ${pass ? 'not ' : ''}be a valid JSON string`,
  };
};

export const toEqualWithDiff = (received: any, expected: any) => {
  const pass = equals(received, expected);
  const diffString =
    jestDiff(expected, received, {
      expand: false,
      includeChangeCounts: true,
    }) ?? 'No visual diff available';

  return {
    pass,
    message: () =>
      pass
        ? `✅ toEqualWithDiff\n\nExpected: not equal to\n${JSON.stringify(expected, null, 2)}\nReceived:\n${JSON.stringify(received, null, 2)}`
        : `❌ toEqualWithDiff\n\nExpected:\n${JSON.stringify(expected, null, 2)}\nReceived:\n${JSON.stringify(received, null, 2)}\n\nDiff:\n${diffString}`,
  };
};

export const commonMatchers = {
  toBeEmpty,
  toContainKey,
  toContainAllKeys,
  toBeOneOf,
  toBeJsonString,
  toEqualWithDiff,
};