import mongoose from 'mongoose';
import { AccountModel } from '@models';
import { buildAccountQuery } from './accountQueryBuilder';

export async function resolveGetUserAccounts(
  _: any,
  {
    userId,
    first,
    after,
    last,
    before,
    filter = {},
    orderBy = { field: 'id', order: 'ASC' },
  }: {
    userId: string;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
    filter?: {
      type?: string;
      minBalance?: number;
      maxBalance?: number;
    };
    orderBy?: {
      field: string;
      order: 'ASC' | 'DESC';
      direction?: 'ASC' | 'DESC';
    };
  }
) {
  const query = buildAccountQuery(userId, filter);

  const totalCount = await AccountModel.countDocuments(query);

  let accountsQuery = AccountModel.find(query);

  if (after) {
    accountsQuery = accountsQuery.gt('_id', new mongoose.Types.ObjectId(after));
  } else if (before) {
    accountsQuery = accountsQuery.lt('_id', new mongoose.Types.ObjectId(before));
  }

  const { field, order, direction } = orderBy;
  const sortOrder = order || direction || 'ASC';
  const sortDirection = sortOrder === 'DESC' ? -1 : 1;
  const mongoField = field === 'id' ? '_id' : field;
  accountsQuery = accountsQuery.sort({ [mongoField]: sortDirection });

  if (first) {
    accountsQuery = accountsQuery.limit(first);
  } else if (last) {
    accountsQuery = accountsQuery.limit(last);
  }

  const accounts = await accountsQuery.exec();

  const edges = accounts.map((account) => {
    return {
      node: {
        ...account.toObject(),
        id: account.id,
        _id: account.id,
      },
      cursor: account.id,
    };
  });

  const hasNextPage =
    accounts.length > 0 &&
    (await AccountModel.countDocuments({
      ...query,
      _id: { $gt: accounts[accounts.length - 1]._id },
    })) > 0;

  const hasPreviousPage =
    accounts.length > 0 &&
    (await AccountModel.countDocuments({
      ...query,
      _id: { $lt: accounts[0]._id },
    })) > 0;

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
    },
    totalCount,
  };
}