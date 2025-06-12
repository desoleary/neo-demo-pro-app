import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { AccountModel, Account, AccountDocument, AccountType } from '@models';
import { DEFAULT_USER_ID } from './factoryConstants';

export type AccountInput = Account;

export const accountFactory = Factory.define<AccountInput, { userId?: string }>(
  ({ transientParams }) => ({
    userId: transientParams.userId ?? DEFAULT_USER_ID,
    type: faker.helpers.arrayElement(Object.values(AccountType)),
    balance: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
  })
);

export const buildAccountModel = (
  overrides?: Partial<AccountInput>,
  transient?: { userId?: string }
): AccountDocument => {
  const data = accountFactory.build(overrides, { transient });
  return new AccountModel(data);
};

export const createAccountModel = async (
  overrides?: Partial<AccountInput>,
  transient?: { userId?: string }
): Promise<AccountDocument> => {
  const data = accountFactory.build(overrides, { transient });
  return AccountModel.create(data);
};