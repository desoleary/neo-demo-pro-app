export function createObservabilityPlugins() {
  return {
    async serverWillStart() {
      console.log('Observability plugins initialized');
    },
  };
}
