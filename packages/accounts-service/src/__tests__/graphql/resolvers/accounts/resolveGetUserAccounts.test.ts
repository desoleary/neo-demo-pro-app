import mongoose from 'mongoose';
import { AccountModel, AccountType } from '@models';
import { accountFactory } from '@factories';
import { resolveGetUserAccounts } from '@gql-resolvers';

describe('resolveGetUserAccounts', () => {
  const userId1 = '1';
  const userId2 = '2';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await AccountModel.deleteMany({});
    await vi.waitFor(async () => {
      const count = await AccountModel.countDocuments({});
      expect(count).toBe(0);
    });

    await AccountModel.insertMany(
      Array.from({ length: 5 }, (_, i) =>
        accountFactory.build({
          userId: userId1,
          type: i % 2 === 0 ? AccountType.CHEQUING : AccountType.SAVINGS,
          balance: 100 + i * 100,
        })
      ),
      { ordered: true }
    );

    await AccountModel.insertMany(
      Array.from({ length: 2 }, () =>
        accountFactory.build({
          userId: userId2,
          type: AccountType.SAVINGS,
          balance: 500,
        })
      ),
      { ordered: true }
    );

    // Add waitFor to ensure inserts are visible
    await vi.waitFor(async () => {
      const count = await AccountModel.countDocuments({ userId: userId1 });
      expect(count).toBeGreaterThanOrEqual(1);
      const count2 = await AccountModel.countDocuments({ userId: userId2 });
      expect(count2).toBeGreaterThanOrEqual(1);
    });
  });

  it('returns accounts for given userId', async () => {
    const result = await resolveGetUserAccounts({}, { userId: userId1 });

    expect(result.totalCount).toBeGreaterThanOrEqual(1);
    expect(result.edges.length).toBeGreaterThanOrEqual(1);
    result.edges.forEach(edge => {
      expect(edge.node.userId).toBe(userId1);
      expect(edge.node).toHaveProperty('id');
      expect(edge.node).toHaveProperty('balance');
    });
  });

  it('supports pagination (first)', async () => {
    const result = await resolveGetUserAccounts({}, { userId: userId1, first: 3 });

    expect(result.edges.length).toBe(3);
    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.hasPreviousPage).toBe(false);
    expect(result.pageInfo.startCursor).toBeDefined();
    expect(result.pageInfo.endCursor).toBeDefined();
  });

  it('supports filtering by type', async () => {
    const result = await resolveGetUserAccounts({}, {
      userId: userId1,
      filter: { type: AccountType.CHEQUING },
    });

    expect(result.totalCount).toBe(3); // 3 CHEQUING out of 5
    result.edges.forEach(edge => {
      expect(edge.node.type).toBe(AccountType.CHEQUING);
    });
  });

  it('supports filtering by minBalance', async () => {
    const result = await resolveGetUserAccounts({}, {
      userId: userId1,
      filter: { minBalance: 300 },
    });

    expect(result.totalCount).toBe(3);
    result.edges.forEach(edge => {
      expect(edge.node.balance).toBeGreaterThanOrEqual(300);
    });
  });

  it('returns empty result for unknown user', async () => {
    const result = await resolveGetUserAccounts({}, { userId: '999' });

    expect(result.totalCount).toBe(0);
    expect(result.edges).toEqual([]);
    expect(result.pageInfo.hasNextPage).toBe(false);
    expect(result.pageInfo.hasPreviousPage).toBe(false);
  });

  it('supports sorting DESC', async () => {
    const result = await resolveGetUserAccounts({}, {
      userId: userId1,
      orderBy: { field: 'balance', order: 'DESC' },
    });

    const balances = result.edges.map(edge => edge.node.balance);
    const sorted = [...balances].sort((a, b) => b - a);

    expect(balances).toEqual(sorted);
  });
});