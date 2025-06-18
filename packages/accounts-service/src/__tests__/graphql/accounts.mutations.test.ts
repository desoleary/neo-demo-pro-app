import { createTestServer } from '@test-utils/setupTestServer';
import mongoose from 'mongoose';
import { AccountModel } from '@models';

describe('Account Mutations', () => {
  const { query } = createTestServer();

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create an account', async () => {
    const res = await query(`
      mutation {
        createAccount(input: {
          userId: "user-test-1",
          type: "SAVINGS",
          balance: 1000
        }) {
          id
          userId
          type
          balance
        }
      }
    `);

    expect(res).toBeValidGraphQLResponse();
    expect(res.data?.createAccount).toMatchObject({
      userId: "user-test-1",
      type: "SAVINGS",
      balance: 1000,
    });
  });

  it('should update an account', async () => {
    const created = await AccountModel.create({
      userId: 'user-test-2',
      type: 'CHEQUING',
      balance: 500,
    });

    // Wait until document is queryable
    await vi.waitFor(async () => {
      const found = await AccountModel.findById(created._id);
      expect(found).not.toBeNull();
    });

    const res = await query(`
    mutation {
      updateAccount(input: {
        id: "${created._id}",
        balance: 750
      }) {
        id
        userId
        type
        balance
      }
    }
  `);

    expect(res).toBeValidGraphQLResponse();
    expect(res.data?.updateAccount.balance).toBe(750);
  });

  it('should delete an account', async () => {
    const created = await AccountModel.create({
      userId: 'user-test-3',
      type: 'SAVINGS',
      balance: 200,
    });

    const res = await query(`
      mutation {
        deleteAccount(id: "${created._id}") {
          success
        }
      }
    `);

    expect(res).toBeValidGraphQLResponse();
    expect(res.data?.deleteAccount.success).toBe(true);

    const account = await AccountModel.findById(created._id);
    expect(account).toBeNull();
  });
});