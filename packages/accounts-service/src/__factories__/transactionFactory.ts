import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import TransactionModel, { Transaction, TransactionDocument, TransactionType } from '@models/Transaction';
import { accountFactory } from './accountFactory';
import type { AccountInput } from './accountFactory';
import { DEFAULT_ACCOUNT_ID } from './factoryConstants';

export type TransactionInput = Transaction;

export const transactionFactory = Factory.define<TransactionInput, { account?: AccountInput }>(
  ({ transientParams }) => {
    const account = transientParams.account ?? accountFactory.build();

    return {
      accountId: account?.userId ?? DEFAULT_ACCOUNT_ID,
      type: faker.helpers.arrayElement(Object.values(TransactionType)),
      amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      date: faker.date.past({ years: 1 }),
    };
  }
);

export const buildTransactionModel = (overrides?: Partial<TransactionInput>, transient?: { account?: AccountInput }): TransactionDocument => {
  const data = transactionFactory.build(overrides, { transient });
  return new TransactionModel(data);
};

export const createTransactionModel = async (overrides?: Partial<TransactionInput>, transient?: { account?: AccountInput }): Promise<TransactionDocument> => {
  const model = buildTransactionModel(overrides, transient);
  await model.save();
  return model;
};