import { resolveGetUserAccounts } from './accounts';
import { resolveGetTransactionHistory } from './transactions';

export const Query = {
  accounts: resolveGetUserAccounts,
  getUserAccounts: resolveGetUserAccounts,
  getTransactionHistory: resolveGetTransactionHistory,
};