import { GraphQLResponse } from '@apollo/server';
import GraphqlResponseWrapper from '../GraphqlResponseWrapper';
import { colours } from '../matcherUtils';

/**
 * Asserts that a GraphQL response is valid.
 *
 * A GraphQL response is valid if it contains no errors and has a 'data' key.
 *
 * If the response is not valid, an error message is logged to the console
 * with the list of errors and the raw response.
 *
 * The response is also checked for expected shape:
 * {
 *   data: any object,
 *   errors: array (can be empty)
 * }
 *
 * @param received - a GraphQL response
 * @returns an object with a `pass` property and a `message` property
 *          that can be used with Vitest's `expect` function.
 */
export const toBeValidGraphQLResponse = function(this: any, received: GraphQLResponse<any>) {
  const wrapper = new GraphqlResponseWrapper(received);

  const pass = wrapper.success();

  const shapePass = this.equals(
    {
      data: wrapper.hasData() ? wrapper.dataRaw : undefined,
      errors: wrapper.errors() ?? [],
    },
    expect.objectContaining({
      data: expect.any(Object),
      errors: expect.any(Array),
    })
  );

  if (!pass || !shapePass) {
    console.log('\n');

    if (wrapper.errors().length === 1) {
      console.log(`${colours.cyanText('Error:')} ${wrapper.formattedErrors()[0]}`);
    } else if (wrapper.errors().length > 1) {
      console.log(colours.cyanText('Errors:'));
      console.log(wrapper.formattedErrors().join('\n'));
    }

    if (!shapePass) {
      console.log(colours.cyanText('Shape Error:'));
      console.log('Expected response shape:');
      printResponseShape({
        data: wrapper.hasData() ? wrapper.dataRaw : undefined,
        errors: wrapper.errors() ?? [],
      });
    } else {
      console.log(colours.cyanText('Raw Response:'));
      console.log(wrapper.formattedResponse());
    }

    console.log('\n');
  }

  return {
    pass: pass && shapePass,
    message: () => {
      if (!shapePass) {
        return `expected GraphQL result to match shape { data: Object, errors: Array }`;
      }
      if (!wrapper.hasData()) {
        return `expected GraphQL result to have 'data', but received:\n${wrapper.formattedResponse()}`;
      }
      if (wrapper.errors().length > 0) {
        return `expected GraphQL result to have no errors, but received errors:\n    - ${wrapper.errorMessages().join('\n- ')}`;
      }
      return `expected GraphQL result to be valid`;
    },
  };
};

// Helper to print response shape in friendly format
function printResponseShape(response: { data: unknown; errors: unknown }) {
  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) return '[]';
    if (value !== null && typeof value === 'object') return '{ ... }';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  console.log(`{\n  data: ${formatValue(response.data)},\n  errors: ${formatValue(response.errors)}\n}`);
}

export const graphqlMatchers = {
  toBeValidGraphQLResponse,
};