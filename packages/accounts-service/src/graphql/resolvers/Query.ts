import mongoose from 'mongoose';
import AccountModel from '../../models/Account';
import TransactionModel from '../../models/Transaction';
import { mapTransactions } from '../mappers/TransactionMapper';

export const Query = {
  accounts: resolveGetUserAccounts,
  getUserAccounts: resolveGetUserAccounts,
  getTransactionHistory: async (_: any, { accountId }: { accountId: string }) => {
    const transactions = await TransactionModel.find({ accountId }).exec();
    return mapTransactions(transactions);
  },
};

async function resolveGetUserAccounts(
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
  const query: any = {
    $or: [
      { userId },
      { userId: typeof userId === 'string' ? parseInt(userId, 10) : userId },
    ].filter(Boolean),
  };

  if (filter) {
    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.minBalance !== undefined || filter.maxBalance !== undefined) {
      query.balance = {};
      if (filter.minBalance !== undefined) {
        query.balance.$gte = filter.minBalance;
      }
      if (filter.maxBalance !== undefined) {
        query.balance.$lte = filter.maxBalance;
      }
    }
  }

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
    const { _id, ...rest } = account.toObject();
    return {
      node: {
        ...rest,
        id: _id.toString(),
        _id: _id.toString(),
      },
      cursor: _id.toString(),
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