import colours from './colours'
type GraphQLError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};

export default class GraphqlResponseWrapper<TData = unknown> {
  private readonly graphqlQueryResult: any;

  constructor(graphqlQueryResult: any) {
    this.graphqlQueryResult =
      typeof graphqlQueryResult === 'string'
        ? JSON.parse(graphqlQueryResult)
        : graphqlQueryResult;
  }

  get data(): TData | undefined {
    const keys = this.dataKeys();
    if (keys.length !== 1) {
      throw new Error(
        `Expected single root field in data, found: ${keys.join(', ')}`,
      );
    }
    return this.graphqlQueryResult.data?.[keys[0]];
  }

  get dataRaw(): any {
    return this.graphqlQueryResult.data;
  }

  get mutationName(): string | undefined {
    const keys = this.dataKeys();
    return keys.length > 0 ? keys[0] : undefined;
  }

  hasData(): boolean {
    return (
      typeof this.graphqlQueryResult === 'object' &&
      this.graphqlQueryResult !== null &&
      'data' in this.graphqlQueryResult
    );
  }

  success(): boolean {
    return this.hasData() && this.errors().length === 0;
  }

  failure(): boolean {
    return !this.success();
  }

  errors(): GraphQLError[] {
    return this.graphqlQueryResult.errors || [];
  }

  errorMessages(): string[] {
    return this.errors().map((err) => err.message);
  }

  formattedErrors(): string[] {
    const errorMessages = this.errorMessages();

    if (errorMessages.length === 0) {
      return [colours.greenText('<none>')];
    }

    if (errorMessages.length === 1) {
      return [colours.redText(errorMessages[0])];
    }

    return errorMessages.map((msg: string) => `- ${colours.redText(msg)}`);
  }

  formattedResponse(): string {
    return JSON.stringify(this.graphqlQueryResult, null, 2);
  }

  private dataKeys(): string[] {
    if (!this.graphqlQueryResult.data) return [];
    return Object.keys(this.graphqlQueryResult.data);
  }
}