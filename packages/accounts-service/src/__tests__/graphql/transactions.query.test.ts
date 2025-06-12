import { createTestServer } from '@test-utils/setupTestServer';
import mongoose from 'mongoose';
import { accountFactory, transactionFactory } from '@factories';
import { AccountModel, TransactionModel } from '@models';
import type { AccountDocument } from '@models';

describe('Transactions API', () => {
  const { query } = createTestServer();

  let account: AccountDocument; // store the inserted account

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);

    await TransactionModel.deleteMany({});
    await AccountModel.deleteMany({});

    const accountData = accountFactory.build({ userId: '1' });

    account = await AccountModel.create({
      ...accountData,
      _id: new mongoose.Types.ObjectId('000000000000000000000001'),
    });

    await TransactionModel.create(
      transactionFactory.build({}, { transient: { account } })
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('fetches transactions for a given account', async () => {
    const res = await query(`
      query {
        getTransactionHistory(accountId: "${account.id.toString()}") {
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

    expect(transactions).toEqualWithDiff(
      expect.arrayContaining([
        expect.objectContaining({
          accountId: account.id.toString(),
          amount: expect.any(Number),
          id: expect.any(String),
          type: expect.stringMatching(/^(DEBIT|CREDIT)$/),
        }),
      ])
    );
  });
});