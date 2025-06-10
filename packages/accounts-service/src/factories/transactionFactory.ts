import { Factory } from 'fishery';
import { accountFactory } from './accountFactory';
import type { AccountInput } from './accountFactory'; // assuming you exported AccountInput

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
      type: Math.random() > 0.5 ? 'DEBIT' : 'CREDIT',
      amount: Math.floor(Math.random() * 1000),
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
);;