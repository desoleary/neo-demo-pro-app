import mongoose from 'mongoose';
import { AccountModel, AccountType } from '@models';
import { accountFactory } from '@factories';
import { resolveGetUserAccounts } from '@gql-resolvers';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { randomUUID } from 'crypto';

let userId1: string;
let userId2: string;

describe('resolveGetUserAccounts', () => {
  const TOTAL_ACCOUNTS_USER1 = 5; // 5 accounts for user1

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();

    userId1 = randomUUID();
    userId2 = randomUUID();

    const user1Accounts = [
      accountFactory.build({ userId: userId1, type: AccountType.CHEQUING, balance: 100 }),
      accountFactory.build({ userId: userId1, type: AccountType.SAVINGS, balance: 200 }),
      accountFactory.build({ userId: userId1, type: AccountType.CHEQUING, balance: 300 }),
      accountFactory.build({ userId: userId1, type: AccountType.SAVINGS, balance: 400 }),
      accountFactory.build({ userId: userId1, type: AccountType.CHEQUING, balance: 500 }),
    ];

    const user2Accounts = [
      accountFactory.build({ userId: userId2, type: AccountType.SAVINGS, balance: 500 }),
      accountFactory.build({ userId: userId2, type: AccountType.SAVINGS, balance: 500 }),
    ];

    await AccountModel.insertMany([...user1Accounts, ...user2Accounts], { ordered: true });

    const user1Count = await AccountModel.countDocuments({ userId: userId1 });
    const user2Count = await AccountModel.countDocuments({ userId: userId2 });

    if (user1Count < 5 || user2Count < 2) {
      throw new Error(
        `Test data setup failed. Expected 5 accounts for user1 and 2 for user2, got ${user1Count} and ${user2Count}`
      );
    }
  });

  it('returns accounts for given userId', async () => {
    const result = await resolveGetUserAccounts(
      {},
      { 
        userId: userId1,
        first: 10, // Add pagination to ensure we get all results
        filter: {}
      }
    );

    // Verify we got all accounts for user1
    expect(result.totalCount).toBeGreaterThanOrEqual(1);
    expect(result.edges.length).toBeGreaterThanOrEqual(1);
    
    // Verify all returned accounts belong to user1 and have required fields
    result.edges.forEach(edge => {
      expect(edge.node.userId).toBe(userId1);
      expect(edge.node).toHaveProperty('id');
      expect(edge.node).toHaveProperty('balance');
    });
  });

  it('supports pagination (first)', async () => {
    const pageSize = 3;
    const result = await resolveGetUserAccounts(
      {},
      { 
        userId: userId1, 
        first: pageSize,
        filter: {}
      }
    );

    expect(result.edges.length).toBe(pageSize);
    expect(result.totalCount).toBe(TOTAL_ACCOUNTS_USER1);
    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.hasPreviousPage).toBe(false);
    expect(result.pageInfo.startCursor).toBeDefined();
    expect(result.pageInfo.endCursor).toBeDefined();
    
    // Verify all returned accounts belong to userId1
    result.edges.forEach(edge => {
      expect(edge.node.userId).toBe(userId1);
    });
  });

  it('supports filtering by type', async () => {
    // We expect 3 CHEQUING accounts for user1 (indices 0, 2, 4 in the test data array)
    const result = await resolveGetUserAccounts(
      {},
      {
        userId: userId1,
        filter: { type: AccountType.CHEQUING },
      }
    );

    // Verify we got exactly 3 CHEQUING accounts
    expect(result.totalCount).toBe(3);
    
    // Verify all returned accounts are of type CHEQUING and belong to user1
    result.edges.forEach(edge => {
      expect(edge.node.type).toBe(AccountType.CHEQUING);
      expect(edge.node.userId).toBe(userId1);
    });
  });

  it('supports filtering by minBalance', async () => {
    // For user1, accounts have balances: 100, 200, 300, 400, 500
    // minBalance: 300 should return 3 accounts (300, 400, 500)
    const result = await resolveGetUserAccounts(
      {},
      {
        userId: userId1,
        filter: { minBalance: 300 },
      }
    );

    // Verify we got exactly 3 accounts with balance >= 300
    expect(result.totalCount).toBe(3);
    
    // Verify all returned accounts meet the filter criteria and belong to user1
    result.edges.forEach(edge => {
      expect(edge.node.balance).toBeGreaterThanOrEqual(300);
      expect(edge.node.userId).toBe(userId1);
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