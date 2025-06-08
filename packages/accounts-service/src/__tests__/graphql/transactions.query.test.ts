import { createTestServer } from '@test-utils/setupTestServer';
import mongoose from 'mongoose';
import { transactionFactory } from '../../factories';
import { TransactionModel } from '../../models';

describe('Transactions API', () => {
  const { query } = createTestServer();

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);

    // Seed test transaction linked to accountId "1"
    await TransactionModel.deleteMany({});
    await TransactionModel.create(transactionFactory.build({
      accountId: '1',
      type: 'DEBIT',
      amount: 123,
    }));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });


  it('fetches transactions for a given account', async () => {
    const res = await query(`
      query {
        getTransactionHistory(accountId: "1") {
          id
          accountId
          amount
          type
        }
      }
    `);

    expect(res).toBeValidGraphQLResponse();

    const transactions = res.data?.getTransactionHistory;

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);

    // This is much safer than using .every()
    expect(transactions).toEqualWithDiff(
      expect.arrayContaining([
        expect.objectContaining({
          accountId: '1',
          amount: expect.any(Number),
          id: expect.any(String),
          type: expect.stringMatching(/^(DEBIT|CREDIT)$/),
        }),
      ]),
    );
  });
});