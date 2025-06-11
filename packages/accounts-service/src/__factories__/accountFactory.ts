import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { AccountModel, Account, AccountDocument, AccountType } from '@models';

export type AccountInput = Account;

export const accountFactory = Factory.define<AccountInput>(({ sequence }) => ({
  userId: (sequence % 10).toString(),
  type: faker.helpers.arrayElement(Object.values(AccountType)),
  balance: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
}));

// Optional - for building unsaved models
export const buildAccountModel = (overrides?: Partial<AccountInput>): AccountDocument => {
  const data = accountFactory.build(overrides);
  return AccountModel.hydrate(data);
};

// Recommended - for creating + saving model in tests
export const createAccountModel = async (overrides?: Partial<AccountInput>): Promise<AccountDocument> => {
  const data = accountFactory.build(overrides);
  return AccountModel.create(data);
};