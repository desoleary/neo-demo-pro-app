import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildPageInfo } from '@gql-utils';
import mongoose from 'mongoose';

describe('buildPageInfo', () => {
  // Clean mock model — no type arguments needed here
  const mockModel = {
    countDocuments: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct pageInfo when there are no results', async () => {
    mockModel.countDocuments.mockResolvedValue(0);

    const pageInfo = await buildPageInfo({
      query: {},
      model: mockModel as unknown as mongoose.Model<any>,
      results: [],
    });

    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    });
  });

  it('returns correct pageInfo with results and no next/previous pages', async () => {
    mockModel.countDocuments.mockResolvedValue(0);

    const results = [
      { _id: new mongoose.Types.ObjectId() },
      { _id: new mongoose.Types.ObjectId() },
    ];

    const pageInfo = await buildPageInfo({
      query: {},
      model: mockModel as unknown as mongoose.Model<any>,
      results,
    });

    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: results[0]._id.toString(),
      endCursor: results[1]._id.toString(),
    });

    expect(mockModel.countDocuments).toHaveBeenCalledTimes(2);
  });

  it('returns correct pageInfo with next page', async () => {
    mockModel.countDocuments
      .mockResolvedValueOnce(5) // hasNextPage → true
      .mockResolvedValueOnce(0); // hasPreviousPage → false

    const results = [
      { _id: new mongoose.Types.ObjectId() },
      { _id: new mongoose.Types.ObjectId() },
    ];

    const pageInfo = await buildPageInfo({
      query: {},
      model: mockModel as unknown as mongoose.Model<any>,
      results,
    });

    expect(pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: results[0]._id.toString(),
      endCursor: results[1]._id.toString(),
    });
  });

  it('returns correct pageInfo with previous page', async () => {
    mockModel.countDocuments
      .mockResolvedValueOnce(0) // hasNextPage → false
      .mockResolvedValueOnce(3); // hasPreviousPage → true

    const results = [
      { _id: new mongoose.Types.ObjectId() },
      { _id: new mongoose.Types.ObjectId() },
    ];

    const pageInfo = await buildPageInfo({
      query: {},
      model: mockModel as unknown as mongoose.Model<any>,
      results,
    });

    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: true,
      startCursor: results[0]._id.toString(),
      endCursor: results[1]._id.toString(),
    });
  });

  it('returns correct pageInfo with both next and previous pages', async () => {
    mockModel.countDocuments
      .mockResolvedValueOnce(2) // hasNextPage → true
      .mockResolvedValueOnce(4); // hasPreviousPage → true

    const results = [
      { _id: new mongoose.Types.ObjectId() },
      { _id: new mongoose.Types.ObjectId() },
    ];

    const pageInfo = await buildPageInfo({
      query: {},
      model: mockModel as unknown as mongoose.Model<any>,
      results,
    });

    expect(pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: true,
      startCursor: results[0]._id.toString(),
      endCursor: results[1]._id.toString(),
    });
  });
});