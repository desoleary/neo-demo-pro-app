import { ApolloGateway } from '@apollo/gateway';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';
import { default as fetch } from 'node-fetch';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const SUBGRAPHS = [
  { name: 'auth-service', url: 'http://localhost:4001/graphql' },
  { name: 'accounts-service', url: 'http://localhost:4002/graphql' },
  { name: 'rewards-service', url: 'http://localhost:4003/graphql' },
  { name: 'transfers-service', url: 'http://localhost:4004/graphql' },
];

const MAX_RETRIES = 10;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function isServiceReady(url: string): Promise<boolean> {
  try {
    // Try to access the GraphQL endpoint directly
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function waitForServices() {
  console.log('Waiting for services to be ready...');
  
  for (const service of SUBGRAPHS) {
    let retries = 0;
    let isReady = false;
    
    while (retries < MAX_RETRIES && !isReady) {
      isReady = await isServiceReady(service.url);
      
      if (!isReady) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
        console.log(`Service ${service.name} not ready, retrying in ${delay}ms...`);
        await setTimeout(delay);
        retries++;
      }
    }
    
    if (!isReady) {
      throw new Error(`Service ${service.name} at ${service.url} did not become available after ${MAX_RETRIES} retries`);
    }
    
    console.log(`✓ ${service.name} is ready at ${service.url}`);
  }
}

async function startGateway() {
  try {
    await waitForServices();
    
    const gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: SUBGRAPHS,
      }),
    });

    const server = new ApolloServer({
      gateway,
      plugins: [createObservabilityPlugins()],
    });

    const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
    console.log(`🚀 Gateway ready at ${url}`);
  } catch (error) {
    console.error('Failed to start gateway:', error);
    process.exit(1);
  }
}

startGateway();
