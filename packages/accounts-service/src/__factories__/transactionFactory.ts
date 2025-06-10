import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import TransactionModel from '@models/Transaction';
import { accountFactory } from './accountFactory';
import type { AccountInput } from './accountFactory';

export interface TransactionInput {
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const transactionFactory = Factory.define<TransactionInput, { account?: AccountInput }>(
  ({ transientParams }) => {
    const account = transientParams.account ?? accountFactory.build();

    return {
      accountId: account.userId,
      type: faker.helpers.arrayElement(['DEBIT', 'CREDIT']),
      amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      date: faker.date.past({ years: 1 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
);

export const buildTransactionModel = (overrides?: Partial<TransactionInput>, transient?: { account?: AccountInput }) => {
  const data = transactionFactory.build(overrides, { transient });
  return new TransactionModel(data);
};

export const createTransactionModel = async (overrides?: Partial<TransactionInput>, transient?: { account?: AccountInput }) => {
  const model = buildTransactionModel(overrides, transient);
  await model.save();
  return model;
};