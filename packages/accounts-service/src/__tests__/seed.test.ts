import { seed } from '../seed';
import { AccountModel, TransactionModel } from '@models';
import mongoose from 'mongoose';

describe('Seed script', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);

    await AccountModel.deleteMany({});
    await TransactionModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should seed accounts and transactions', async () => {
    await seed({ skipDisconnect: true });

    const accountCount = await AccountModel.countDocuments();
    const transactionCount = await TransactionModel.countDocuments();

    expect(accountCount).toBeGreaterThan(0);
    expect(transactionCount).toBeGreaterThan(0);
  });
});