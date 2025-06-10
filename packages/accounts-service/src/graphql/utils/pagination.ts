import mongoose from 'mongoose';

export async function buildPageInfo({
                                      query,
                                      model,
                                      results,
                                    }: {
  query: any;
  model: mongoose.Model<any>;
  results: any[];
}) {
  if (results.length === 0) {
    return {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    };
  }

  const lastId = results[results.length - 1]._id;
  const firstId = results[0]._id;

  const hasNextPage = (await model.countDocuments({
    ...query,
    _id: { $gt: lastId },
  })) > 0;

  const hasPreviousPage = (await model.countDocuments({
    ...query,
    _id: { $lt: firstId },
  })) > 0;

  return {
    hasNextPage,
    hasPreviousPage,
    startCursor: firstId.toString(),
    endCursor: lastId.toString(),
  };
}