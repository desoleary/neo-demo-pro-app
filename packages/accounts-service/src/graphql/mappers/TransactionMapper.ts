import type { Transaction } from '../../models';
import { WithId } from '@types';

export function mapTransaction(transaction: WithId<Transaction>) {
  const { _id, date, ...rest } = transaction as any;
  return {
    id: _id.toString(),
    date: date instanceof Date ? date.toISOString() : date,
    ...rest,
  };
}

export function mapTransactions(transactions: WithId<Transaction>[]) {
  return transactions.map(mapTransaction);
}