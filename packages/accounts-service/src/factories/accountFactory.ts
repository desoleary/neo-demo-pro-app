import { Factory } from 'fishery';
import { Account, Transaction } from '../data';

export const accountFactory = Factory.define<Omit<Account, 'id'>>(({ sequence }) => ({
  userId: (sequence % 10).toString(),
  type: ['chequing', 'savings'][sequence % 2],
  balance: 1000 * (sequence % 5),
}));

export const transactionFactory = Factory.define<Omit<Transaction, 'id'>>(({ sequence }) => ({
  accountId: (sequence % 10).toString(),
  amount: 50,
  date: new Date().toISOString(),
}));
