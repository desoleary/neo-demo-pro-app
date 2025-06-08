
import { TransactionModel } from '../../models';
import mongoose from 'mongoose';

describe('Transaction Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid Transaction document', async () => {
    const transaction = await TransactionModel.create({
      id: 'test-transaction',
      accountId: 'test-account',
      amount: 200,
      date: new Date(),
      type: 'DEBIT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(transaction).toHaveProperty('_id');
    expect(transaction.accountId).toBe('test-account');
    expect(transaction.amount).toBe(200);
  });
});
