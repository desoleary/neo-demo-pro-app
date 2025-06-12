import { seed, DEFAULT_NUMBER_OF_RECORDS, MANUAL_TRANSACTION_COUNT } from '../seed';
import { AccountModel, TransactionModel } from '@models';
import mongoose from 'mongoose';

describe('Seed script', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
  });

  it('should seed accounts and transactions', async () => {
    await seed({ skipDisconnect: true, forceRefresh: true });

    const accountCount = await AccountModel.countDocuments();
    const transactionCount = await TransactionModel.countDocuments();

    expect(accountCount).toBe(DEFAULT_NUMBER_OF_RECORDS);
    expect(transactionCount).toBe(DEFAULT_NUMBER_OF_RECORDS + MANUAL_TRANSACTION_COUNT);
  });
});