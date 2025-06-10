import { createTestServer } from '@test-utils/setupTestServer';
import mongoose from 'mongoose';
import { accountFactory, transactionFactory } from '@factories';
import { AccountModel, TransactionModel } from '@models';

describe('Transactions API', () => {
  const { query } = createTestServer();

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);

    await TransactionModel.deleteMany({});
    await AccountModel.deleteMany({});

    const account = await AccountModel.create(accountFactory.build({ userId: '1' }));

    await TransactionModel.create(
      transactionFactory.build({}, { transient: { account } })
    );

    // Debug — confirm what is in the DB
    const txs = await TransactionModel.find({}).lean();
    console.log('Seeded transactions:', txs);
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