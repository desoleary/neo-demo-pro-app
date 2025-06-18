import { AccountModel } from '@models';
import { buildAccountQuery } from './accountQueryBuilder';
import { paginateMongoResults, mapPaginationInputToArgs } from '@neo-rewards/skeleton';
import type { PaginationInput } from '@neo-rewards/skeleton';

type AccountFilter = {
  type?: string;
  minBalance?: number;
  maxBalance?: number;
};

type GetUserAccountsArgs = PaginationInput & {
  userId: string;
  filter?: AccountFilter;
};

export async function resolveGetUserAccounts(
  _: unknown,
  args: GetUserAccountsArgs
) {
  const { userId, first, after, last, before, orderBy, filter = {} } = args;

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