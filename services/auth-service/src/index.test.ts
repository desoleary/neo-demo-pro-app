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

describe('auth-service', () => {
  it('login and update tier', async () => {
    const loginRes = await fetchGql('query { login(email: "test@example.com", fullName: "Test") }');
    expect(loginRes.data.login).toBeTruthy();

    const profileRes = await fetchGql('query { getUserProfile(id: "1") }');
    expect(profileRes.errors).toBeTruthy();
  });
});
