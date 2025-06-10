import mongoose from 'mongoose';
import { AccountModel } from '../../models';

describe('Account Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid Account document', async () => {
    const account = await AccountModel.create({
      id: 'test-id',
      userId: 'test-user',
      type: 'SAVINGS',
      balance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(account).toHaveProperty('_id');
    expect(account.userId).toBe('test-user');
    expect(account.balance).toBe(500);
  });
});
