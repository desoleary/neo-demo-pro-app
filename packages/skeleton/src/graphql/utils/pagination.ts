import mongoose from 'mongoose';

type PaginationArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export async function paginateMongoResults<T>(
  model: mongoose.Model<T>,
  baseQuery: mongoose.FilterQuery<T>,
  {
    first,
    after,
    last,
    before,
    sortField = '_id',
    sortOrder = 'ASC',
  }: PaginationArgs
) {
  let query = model.find(baseQuery);

  if (after) {
    query = query.gt('_id', new mongoose.Types.ObjectId(after));
  } else if (before) {
    query = query.lt('_id', new mongoose.Types.ObjectId(before));
  }

  const direction = sortOrder === 'DESC' ? -1 : 1;
  query = query.sort({ [sortField]: direction });

  if (first) {
    query = query.limit(first);
  } else if (last) {
    query = query.limit(last);
  }

  const results = await query.exec();

  const hasNextPage =
    results.length > 0 &&
    (await model.countDocuments({
      ...baseQuery,
      _id: { $gt: results[results.length - 1]._id },
    })) > 0;

  const hasPreviousPage =
    results.length > 0 &&
    (await model.countDocuments({
      ...baseQuery,
      _id: { $lt: results[0]._id },
    })) > 0;

  const edges = results.map((doc: any) => ({
    node: {
      ...doc.toObject(),
      id: doc.id,
      _id: doc.id,
    },
    cursor: doc.id,
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
    },
  };
}

import { PaginationInput } from '../../types';

export function mapPaginationInputToArgs(input: PaginationInput): PaginationArgs {
  const {
    first,
    after,
    last,
    before,
    orderBy = { field: '_id', order: 'ASC' },
  } = input;

  const sortOrder = orderBy.order || orderBy.direction || 'ASC';
  const sortField = orderBy.field === 'id' ? '_id' : orderBy.field;

  return {
    first,
    after,
    last,
    before,
    sortField,
    sortOrder,
  };
}