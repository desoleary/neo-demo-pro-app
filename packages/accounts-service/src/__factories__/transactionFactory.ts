import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import TransactionModel, { Transaction, TransactionDocument, TransactionType } from '@models/Transaction';
import { AccountDocument } from '@models';

export type TransactionInput = Transaction;

export const transactionFactory = Factory.define<TransactionInput, { account?: AccountDocument }>(
  ({ transientParams }) => {
    const account = transientParams.account;
    if (!account) throw new Error('transactionFactory requires account in transientParams');

    return {
      accountId: account._id.toString(), // USE THIS — not `account.id`
      type: faker.helpers.arrayElement(Object.values(TransactionType)),
      amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      date: faker.date.past({ years: 1 }),
    };
  }
);

export const buildTransactionModel = (
  overrides?: Partial<TransactionInput>,
  transient?: { account?: AccountDocument }
): TransactionDocument => {
  const data = transactionFactory.build(overrides, { transient });
  return new TransactionModel(data);
};

export const createTransactionModel = async (
  overrides?: Partial<TransactionInput>,
  transient?: { account?: AccountDocument }
): Promise<TransactionDocument> => {
  const model = buildTransactionModel(overrides, transient);
  await model.save();
  return model;
};