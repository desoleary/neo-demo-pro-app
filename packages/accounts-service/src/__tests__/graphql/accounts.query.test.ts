import { createTestServer } from '@test-utils/setupTestServer';
import mongoose from 'mongoose';

describe('Accounts API', () => {
  const { query } = createTestServer();

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it(
    'should fetch first 5 accounts',
    async () => {
      const res = await query(`
      query {
        accounts(userId: "1", first: 5) {
          totalCount
          edges {
            node {
              id
              userId
              type
              balance
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `);

      expect(res).toBeValidGraphQLResponse();
    }
  );
});