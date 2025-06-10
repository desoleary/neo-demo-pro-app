import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import AccountModel from '@models/Account';
import type { Account } from '@models/Account';

export type AccountInput = Omit<Account, '_id'>;

export const accountFactory = Factory.define<AccountInput>(({ sequence }) => ({
  userId: (sequence % 10).toString(),
  type: faker.helpers.arrayElement(['chequing', 'savings']),
  balance: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
}));

export const buildAccountModel = (overrides?: Partial<AccountInput>) => {
  const data = accountFactory.build(overrides);
  return new AccountModel(data);
};

export const createAccountModel = async (overrides?: Partial<AccountInput>) => {
  const model = buildAccountModel(overrides);
  await model.save();
  return model;
};