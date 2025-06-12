import { toBeValidGraphQLResponse } from '../matchers/graphql-matchers';

// Mock GraphqlResponseWrapper so we can control all branches
vi.mock('../GraphqlResponseWrapper', () => {
  return {
    default: vi.fn().mockImplementation((response) => {
      return {
        success: () => !response.errors?.length && response.data !== undefined,
        hasData: () => response.data !== undefined,
        dataRaw: response.data,
        errors: () => response.errors ?? [],
        formattedErrors: () => (response.errors ?? []).map((e: { message: any; }) => e.message ?? 'unknown'),
        formattedResponse: () => JSON.stringify(response, null, 2),
        errorMessages: () => (response.errors ?? []).map((e: { message: any; }) => e.message ?? 'unknown'),
      };
    }),
  };
});

describe('toBeValidGraphQLResponse', () => {
  const runMatcher = (response: any, equalsImpl?: (a: any, b: any) => boolean) =>
    toBeValidGraphQLResponse.call(
      {
        equals: equalsImpl ?? (() => true), // correct!
      },
      response
    );

  beforeEach(() => {
    vi.restoreAllMocks(); // clean any previous mocks
  });

  it('passes for valid response', () => {
    const result = toBeValidGraphQLResponse.call(
      {
        equals: () => true, // force shapePass === true
      },
      {
        // @ts-ignore
        data: { foo: 'bar' },
        errors: [],
      }
    );

    expect(result.pass).toBe(true);
    expect(result.message()).toContain('expected GraphQL result to be valid');
  });

  it('fails when there are errors', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {}); // suppress console

    const result = toBeValidGraphQLResponse.call(
      {
        equals: () => true, // force shapePass === true
      },
      {
        // @ts-ignore
        data: { foo: 'bar' },
        errors: [{ message: 'Something went wrong' }],
      }
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('expected GraphQL result to have no errors');

    consoleSpy.mockRestore(); // cleanup
  });

  it('fails when no data is present', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {}); // suppress console
    const result = runMatcher({
      errors: [],
    });
    expect(result.pass).toBe(false);
    expect(result.message()).toContain("expected GraphQL result to have 'data'");
    consoleSpy.mockRestore();
  });

  it('fails when shape is invalid (no data, errors not array)', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {}); // suppress

    const result = toBeValidGraphQLResponse.call(
      {
        equals: () => false, // force shapePass === false
      },
      {
        // @ts-ignore
        errors: [],
      }
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('expected GraphQL result to match shape');

    consoleSpy.mockRestore(); // restore after test
  });

  it('prints single error correctly', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    runMatcher({
      data: { foo: 'bar' },
      errors: [{ message: 'Single error' }],
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Single error'));

    consoleSpy.mockRestore();
  });

  it('prints multiple errors correctly', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    runMatcher({
      data: { foo: 'bar' },
      errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Errors:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error 1'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error 2'));

    consoleSpy.mockRestore();
  });

  it('prints shape error correctly', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    toBeValidGraphQLResponse.call(
      {
        equals: () => false, // force shape fail
      },
      {
        // @ts-ignore
        errors: [],
      }
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Shape Error:'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Expected response shape:'));

    consoleSpy.mockRestore();
  });

  it('prints raw response when pass fails but shape passes', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Force equals to pass (shapePass === true), but success() will return false due to errors
    runMatcher(
      {
        data: { foo: 'bar' },
        errors: [{ message: 'Error' }],
      },
      () => true // force shapePass === true
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Raw Response:'));

    consoleSpy.mockRestore();
  });
});
