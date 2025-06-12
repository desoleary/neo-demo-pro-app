import type { Transaction } from '@models';
import { WithId } from '@types';

export function mapTransaction(transaction: WithId<Transaction>) {
  return {
    id: transaction._id.toString(),
    accountId: transaction.accountId,
    type: transaction.type,
    amount: transaction.amount,
    date: transaction.date.toISOString(),
  };
}

export function mapTransactions(transactions: WithId<Transaction>[]) {
  return transactions.map(mapTransaction);
}