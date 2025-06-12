import { TransactionModel } from '@models';
import { mapTransactions } from '@gql-mappers';

export async function resolveGetTransactionHistory(
  _: any,
  { accountId }: { accountId: string }
) {
  const transactions = await TransactionModel.find({ accountId }).lean();
  return mapTransactions(transactions);
}