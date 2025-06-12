import mongoose from 'mongoose';
import { AccountModel, AccountType } from '@models';
import { accountFactory } from '@factories';

describe('Account Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
    await AccountModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid Account document manually', async () => {
    const account = await AccountModel.create({
      userId: 'test-user-manual',
      type: AccountType.SAVINGS,
      balance: 500,
    });

    expect(account).toHaveProperty('_id');
    expect(account.userId).toBe('test-user-manual');
    expect(account.balance).toBe(500);
    expect(account.type).toBe(AccountType.SAVINGS);
  });

  it('should normalize type enum in pre-save hook', async () => {
    const account = await AccountModel.create({
      userId: 'test-user-normalize',
      type: 'CHEQUING', // string value
      balance: 1000,
    });

    expect(account.type).toBe(AccountType.CHEQUING);
  });

  it('should reject creation without required fields', async () => {
    // Missing userId
    const account = new AccountModel({
      type: AccountType.SAVINGS,
      balance: 250,
    });

    await expect(account.validate()).rejects.toThrow(/userId/);
  });

  it('should create valid Account document using factory', async () => {
    const accountData = accountFactory.build();
    const account = await AccountModel.create(accountData);

    expect(account).toHaveProperty('_id');
    expect(account.userId).toEqual(expect.any(String));
    expect(account.balance).toBeGreaterThan(0);
    expect(account.type).toMatch(/^(CHEQUING|SAVINGS)$/);
  });

  it('factory produces same structure as manual model', async () => {
    const manualAccount = await AccountModel.create({
      userId: 'manual-vs-factory',
      type: AccountType.CHEQUING,
      balance: 1500,
    });

    const factoryAccount = await AccountModel.create(accountFactory.build({
      userId: 'manual-vs-factory',
    }));

    expect(factoryAccount.userId).toBe(manualAccount.userId);
    expect(factoryAccount.balance).toBeGreaterThan(0);
    expect(factoryAccount.type).toMatch(/^(CHEQUING|SAVINGS)$/);
  });
});