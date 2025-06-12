import { buildAccountQuery } from '@gql-resolvers/accounts/accountQueryBuilder';

describe('buildAccountQuery', () => {
  const userId = '123';

  it('builds query with userId only', () => {
    const query = buildAccountQuery(userId);

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
    });
  });

  it('builds query with type filter', () => {
    const query = buildAccountQuery(userId, { type: 'SAVINGS' });

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
      type: 'SAVINGS',
    });
  });

  it('builds query with minBalance only', () => {
    const query = buildAccountQuery(userId, { minBalance: 200 });

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
      balance: {
        $gte: 200,
      },
    });
  });

  it('builds query with maxBalance only', () => {
    const query = buildAccountQuery(userId, { maxBalance: 500 });

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
      balance: {
        $lte: 500,
      },
    });
  });

  it('builds query with both minBalance and maxBalance', () => {
    const query = buildAccountQuery(userId, { minBalance: 200, maxBalance: 500 });

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
      balance: {
        $gte: 200,
        $lte: 500,
      },
    });
  });

  it('builds query with empty filter object', () => {
    const query = buildAccountQuery(userId, {});

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
    });
  });

  it('builds query with undefined filter (default param)', () => {
    const query = buildAccountQuery(userId);

    expect(query).toEqual({
      $or: [{ userId: '123' }, { userId: 123 }],
    });
  });
});
