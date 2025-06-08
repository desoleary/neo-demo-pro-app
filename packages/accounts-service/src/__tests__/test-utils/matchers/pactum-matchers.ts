import isEqual from 'lodash-es/isEqual';

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

export const toMatchPactumMatcher = (received: any, matcher: any) => {
  const pass = matchValue(received, matcher);

  return {
    pass,
    message: () =>
      pass
        ? `✅ expected value NOT to match Pactum matcher, but it did.`
        : `❌ expected value to match Pactum matcher.\n\nReceived:\n${JSON.stringify(received, null, 2)}\n\nExpected matcher:\n${JSON.stringify(matcher, null, 2)}`,
  };
};

// Export as object for expect.extend()
export const pactumMatchers = {
  toMatchPactumMatcher,
};