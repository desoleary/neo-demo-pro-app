import { AccountModel } from '@models';
import { buildAccountQuery } from './accountQueryBuilder';
import { paginateMongoResults, mapPaginationInputToArgs } from '@neo-rewards/skeleton';
import type { PaginationInput } from '@neo-rewards/skeleton';

type GetUserAccountsArgs = PaginationInput & {
  userId: string;
  filter?: {
    type?: string;
    minBalance?: number;
    maxBalance?: number;
  };
};

export async function resolveGetUserAccounts(
  _: unknown,
  {
    userId,
    first,
    after,
    last,
    before,
    orderBy,
    filter = {},
  }: GetUserAccountsArgs
) {
  const query = buildAccountQuery(userId, filter);
  const totalCount = await AccountModel.countDocuments(query);

  const pagination = mapPaginationInputToArgs({
    first,
    after,
    last,
    before,
    orderBy,
  });

  const paginated = await paginateMongoResults(AccountModel, query, pagination);

  return {
    ...paginated,
    totalCount,
  };
}