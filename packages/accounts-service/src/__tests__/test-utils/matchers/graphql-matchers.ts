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
 * @param received - a GraphQL response
 * @returns an object with a `pass` property and a `message` property
 *          that can be used with Vitest's `expect` function.
 */
export const toBeValidGraphQLResponse = (received: GraphQLResponse<any>) => {
  const wrapper = new GraphqlResponseWrapper(received);

  const pass = wrapper.success();

  if (!pass) {
    console.log('\n');

    if (wrapper.errors().length === 1) {
      console.log(`${colours.cyanText('Error:')} ${wrapper.formattedErrors()[0]}`);
    } else {
      console.log(colours.cyanText('Errors:'));
      console.log(wrapper.formattedErrors().join('\n'));
    }

    console.log(colours.cyanText('Raw Response:'));
    console.log(wrapper.formattedResponse());

    console.log('\n');
  }

  return {
    pass,
    message: () => {
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

export const graphqlMatchers = {
  toBeValidGraphQLResponse,
};