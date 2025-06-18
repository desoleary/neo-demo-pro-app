import { resolveUpdateAccount } from '@gql-resolvers/accounts/resolveUpdateAccount';
import { AccountModel } from '@models';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.mock('@models', async () => {
  const actual = await vi.importActual<typeof import('@models')>('@models');
  return {
    ...actual,
    AccountModel: {
      findByIdAndUpdate: vi.fn(),
    },
  };
});

describe('resolveUpdateAccount', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('updates and returns an account object', async () => {
    const validId = new Types.ObjectId();

    const updatedAccount = {
      _id: validId,
      toObject: () => ({
        _id: validId,
        userId: 'u1',
        type: 'CHEQUING',
        balance: 500,
      }),
    };

    // @ts-ignore
    (AccountModel.findByIdAndUpdate as vi.Mock).mockResolvedValue(updatedAccount);

    const result = await resolveUpdateAccount(null, {
      input: { id: validId.toHexString(), balance: 500 },
    });

    expect(result).toEqual({
      id: validId.toHexString(),
      userId: 'u1',
      type: 'CHEQUING',
      balance: 500,
    });
  });

  it('returns null if no account was found', async () => {
    const unusedValidId = new Types.ObjectId().toHexString();

    // @ts-ignore
    (AccountModel.findByIdAndUpdate as vi.Mock).mockResolvedValue(null);

    const result = await resolveUpdateAccount(null,
      {
        // @ts-ignore
        input: { id: unusedValidId, type: 'SAVINGS' },
    });

    expect(result).toBeNull();
  });
});