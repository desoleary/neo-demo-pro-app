import { resolveCreateAccount } from '@gql-resolvers/accounts/resolveCreateAccount';
import { AccountModel } from '@models';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@models', async () => {
  const actual = await vi.importActual<typeof import('@models')>('@models');
  return {
    ...actual,
    AccountModel: {
      create: vi.fn().mockResolvedValue({
        _id: 'acc1',
        userId: 'u1',
        type: 'SAVINGS',
        balance: 200,
        toObject: () => ({
          _id: 'acc1',
          userId: 'u1',
          type: 'SAVINGS',
          balance: 200,
        }),
      }),
    },
  };
});

describe('resolveCreateAccount', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates and returns an account object', async () => {
    const input = { userId: 'u1', type: 'SAVINGS', balance: 200 };
    const result = await resolveCreateAccount(null, { input });

    expect(result).toEqual({
      _id: 'acc1',
      id: 'acc1',
      userId: 'u1',
      type: 'SAVINGS',
      balance: 200,
    });
    expect(AccountModel.create).toHaveBeenCalledWith(input);
  });
});