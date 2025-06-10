import { Factory } from 'fishery';
import type { Account } from '@models/Account';

export type AccountInput = Omit<Account, '_id'>;


export const accountFactory = Factory.define<AccountInput>(({ sequence }) => ({
  userId: (sequence % 10).toString(),
  type: ['chequing', 'savings'][sequence % 2],
  balance: 1000 * (sequence % 5),
}));