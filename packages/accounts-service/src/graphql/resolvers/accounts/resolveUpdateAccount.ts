import { AccountModel, AccountType } from '@models';
import type { Account } from '@models/Account';
import mongoose from 'mongoose';
import { toGraphQLAccount } from '@gql/mappers'; // adjust path as needed


type UpdateAccountInput = {
  id: string;
  type?: AccountType;
  balance?: number;
};

export async function resolveUpdateAccount(
  _: unknown,
  args: { input: UpdateAccountInput }
): Promise<Account | null> {
  const { id, type, balance } = args.input;

  // Validate ID
  if (!id.trim()) {
    throw new Error('Invalid input: id is required');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format: "${id}"`);
  }

  // Validate and build safe update object
  const update: Partial<Pick<Account, 'type' | 'balance'>> = {};

  if (type !== undefined) {
    if (!Object.values(AccountType).includes(type)) {
      throw new Error(`Invalid account type: "${type}"`);
    }
    update.type = type;
  }

  if (balance !== undefined) {
    if (typeof balance !== 'number' || balance < 0) {
      throw new Error('Balance must be a non-negative number');
    }
    update.balance = balance;
  }

  if (Object.keys(update).length === 0) {
    throw new Error('No fields provided to update');
  }

  try {
    const updated = await AccountModel.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      console.warn(`⚠️ Attempted to update non-existent account: ${id}`);
      return null;
    }

    return toGraphQLAccount(updated);
  } catch (error) {
    console.error('❌ Failed to update account:', { id, update, error });
    throw new Error('Internal error: failed to update account');
  }
}