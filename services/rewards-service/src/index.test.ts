import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createServerInstance } from './index';

let server: any;
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongo.getUri();
  server = await createServerInstance();
});

afterAll(async () => {
  await mongo.stop();
});

function fetchGql(query: string) {
  return server.fetch('http://localhost:0', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  }).then((res: any) => res.json());
}

describe('rewards-service', () => {
  it('returns empty rewards', async () => {
    const res = await fetchGql('query { getRewards(userId: "1") { id } }');
    expect(res.data.getRewards).toEqual([]);
  });
});
