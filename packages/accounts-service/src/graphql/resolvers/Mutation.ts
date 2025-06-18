import {
  resolveCreateAccount,
  resolveUpdateAccount,
  resolveDeleteAccount,
} from './accounts';

export const Mutation = {
  createAccount: resolveCreateAccount,
  updateAccount: resolveUpdateAccount,
  deleteAccount: resolveDeleteAccount,
};