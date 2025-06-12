import isEqual from 'lodash-es/isEqual';
import colours from '@test-utils/colours';
import { formatValue } from '@test-utils/matcherUtils';

export const toMatchPactumMatcher = function(this: any, received: unknown, expected: unknown) {
  const pass = matchValue(received, expected);

  return {
    pass,
    message: () => {
      if (pass) {
        return colours.greenText(`expected Pactum response not to match, but it did`);
      } else {
        return colours.redText(`expected Pactum response to match:\n${formatValue(expected)}\nreceived:\n${formatValue(received)}`);
      }
    },
  };
};

function matchValue(value: any, matcher: any): boolean {
  if (matcher && typeof matcher === 'object' && matcher.pactum_type) {
    switch (matcher.pactum_type) {
      case 'LIKE':
        return typeof value === typeof matcher.value;
      case 'REGEX':
        const regex = new RegExp(matcher.matcher);
        return typeof value === 'string' && regex.test(value);
      case 'ARRAY_LIKE':
        if (!Array.isArray(value)) return false;
        if (value.length < (matcher.min || 0)) return false;
        if (matcher.value.length === 0) return true; // No example value, accept
        // Recursively match each item to the first example item
        return value.every(item => matchValue(item, matcher.value[0]));
      default:
        return false;
    }
  }

  // Fallback: deep equal
  if (typeof matcher === 'object' && matcher !== null) {
    return Object.keys(matcher).every(key =>
      matchValue(value?.[key], matcher[key])
    );
  } else {
    return isEqual(value, matcher);
  }
}

export const pactumMatchers = {
  toMatchPactumMatcher,
};