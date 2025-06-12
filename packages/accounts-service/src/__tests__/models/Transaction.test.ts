import mongoose from 'mongoose';
import TransactionModel, { TransactionDocument, TransactionType } from '@models/Transaction';
import { transactionFactory } from '@factories';
import { AccountModel } from '@models';
import { accountFactory } from '@factories';

describe('Transaction Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
    await TransactionModel.deleteMany({});
    await AccountModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a valid Transaction document manually', async () => {
    const transaction = await TransactionModel.create({
      accountId: 'test-account',
      amount: 200,
      date: new Date(),
      type: 'DEBIT',
    });

    expect(transaction).toHaveProperty('_id');
    expect(transaction.accountId).toBe('test-account');
    expect(transaction.amount).toBe(200);
    expect(transaction.type).toBe(TransactionType.DEBIT);
  });

  it('should normalize type enum in pre-save hook', async () => {
    const transaction = await TransactionModel.create({
      accountId: 'test-account-2',
      amount: 300,
      date: new Date(),
      type: 'CREDIT', // simulate passing in enum string
    });

    expect(transaction.type).toBe(TransactionType.CREDIT);
  });

  it('should reject creation without required fields', async () => {
    // Missing accountId, should fail
    const tx = new TransactionModel({
      amount: 100,
      date: new Date(),
      type: 'DEBIT',
    });

    await expect(tx.validate()).rejects.toThrow(/accountId/);
  });

  it('should create valid Transaction document using factory', async () => {
    const account = await AccountModel.create(accountFactory.build({ userId: 'factory-account' }));

    const transactionData = transactionFactory.build({}, { transient: { account } });
    const transaction = await TransactionModel.create(transactionData);

    expect(transaction).toHaveProperty('_id');
    expect(transaction.accountId).toBe(account.id);
    expect(transaction.amount).toBeGreaterThan(0);
    expect(transaction.type).toMatch(/^(DEBIT|CREDIT)$/);
    expect(transaction.date).toBeInstanceOf(Date);
  });

  it('factory produces same structure as manual model', async () => {
    const account = await AccountModel.create(accountFactory.build({ userId: 'factory-account-2' }));

    const manualTx = await TransactionModel.create({
      accountId: account.id,
      amount: 500,
      date: new Date(),
      type: 'DEBIT',
    });

    const factoryTx = await TransactionModel.create(
      transactionFactory.build({}, { transient: { account } })
    );

    // Just comparing common fields — ids will differ
    expect(typeof factoryTx.accountId).toBe('string');
    expect(typeof factoryTx.amount).toBe('number');
    expect(factoryTx.type).toMatch(/^(DEBIT|CREDIT)$/);
    expect(factoryTx.date).toBeInstanceOf(Date);
  });
});