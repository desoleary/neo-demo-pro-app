import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace/index.js';
import { randomUUID } from 'crypto';

export function createObservabilityPlugins(): ApolloServerPlugin[] {
  const loggingPlugin: ApolloServerPlugin = {
    async requestDidStart(
      requestContext: GraphQLRequestContext<any>,
    ): Promise<GraphQLRequestListener> {
      const start = Date.now();
      const correlationId =
        requestContext.request.http?.headers.get('x-correlation-id') ||
        randomUUID();
      return {
        async willSendResponse(ctx) {
          const duration = Date.now() - start;
          const log = {
            level: 'info',
            correlationId,
            operationName: ctx.operationName,
            duration,
            errors: ctx.errors?.map((e) => e.message),
          };
          console.log(JSON.stringify(log));
        },
      };
    },
  };

  return [ApolloServerPluginInlineTrace(), loggingPlugin];
}
