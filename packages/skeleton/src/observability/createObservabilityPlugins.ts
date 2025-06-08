import { ApolloServerPlugin } from '@apollo/server';

export function createObservabilityPlugins(): ApolloServerPlugin {
  return {
    async serverWillStart() {
      console.log('✅ Observability plugins initialized');
    },
    async requestDidStart() {
      const start = Date.now();
      return {
        async willSendResponse({ response }) {
          const duration = Date.now() - start;
          console.log(`GraphQL request completed in ${duration}ms`);
          // here you could send metrics to Prometheus, etc.
        },
      };
    },
  };
}