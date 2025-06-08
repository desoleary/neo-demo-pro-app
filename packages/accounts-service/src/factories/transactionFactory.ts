import { Factory } from 'fishery';

export interface TransactionInput {
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const transactionFactory = Factory.define<TransactionInput>(() => ({
  accountId: Math.floor(Math.random() * 10).toString(),
  type: Math.random() > 0.5 ? 'DEBIT' : 'CREDIT',
  amount: Math.floor(Math.random() * 1000),
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}));