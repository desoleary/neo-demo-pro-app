import { AccountModel } from '@models';
import { AccountType } from '@models/Account';
import type { Account } from '@models/Account';

type CreateAccountInput = {
  userId: string;
  type: AccountType;
  balance: number;
};

export async function resolveCreateAccount(
  _: unknown,
  args: { input: CreateAccountInput }
): Promise<Account> {
  const { userId, type, balance } = args.input;

  if (!userId.trim()) {
    throw new Error('Invalid input: userId is required');
  }

  if (!Object.values(AccountType).includes(type)) {
    throw new Error(`Invalid account type: "${type}"`);
  }

  if (typeof balance !== 'number' || balance < 0) {
    throw new Error('Balance must be a non-negative number');
  }

  try {
    const created = await AccountModel.create({ userId, type, balance });

    return {
      ...created.toObject(),
      id: created._id.toString(), // ✅ ensure GraphQL id is never null
    };
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      throw new Error(`Validation failed: ${error.message}`);
    }

    console.error('❌ Failed to create account:', {
      userId,
      type,
      balance,
      error,
    });

    throw new Error('Internal error: failed to create account');
  }
}