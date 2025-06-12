import mongoose from 'mongoose';
import { resolveGetTransactionHistory } from '@gql-resolvers';
import { TransactionModel, AccountModel } from '@models';
import { createAccountModel, createTransactionModel } from '@factories';

describe('resolveGetTransactionHistory', () => {
  let seededAccountId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);

    // Clear collections
    await TransactionModel.deleteMany({});
    await AccountModel.deleteMany({});

    // Seed a test account
    const account = await createAccountModel();
    seededAccountId = account._id.toString();

    // Seed transactions for this account
    await createTransactionModel({}, { account });
    await createTransactionModel({}, { account });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('fetches transactions for account and maps result', async () => {
    const result = await resolveGetTransactionHistory({}, { accountId: seededAccountId });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    result.forEach(tx => {
      expect(tx).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          accountId: seededAccountId,
          amount: expect.any(Number),
          type: expect.stringMatching(/^(DEBIT|CREDIT)$/),
          date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
        })
      );
    });
  });

  it('returns empty array when no transactions found', async () => {
    const result = await resolveGetTransactionHistory({}, { accountId: 'non-existent' });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });
});
