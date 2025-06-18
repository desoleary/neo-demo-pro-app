import { AccountModel } from '@models';
import mongoose from 'mongoose';

export async function resolveDeleteAccount(
  _: unknown,
  args: { id: string }
): Promise<{ success: boolean }> {
  const { id } = args;

  // Basic validation
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid input: id is required');
  }

  // Optional: validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format: "${id}"`);
  }

  try {
    const deleted = await AccountModel.findByIdAndDelete(id);

    if (!deleted) {
      // Explicitly log not-found condition
      console.warn(`⚠️ Attempted to delete non-existent account: ${id}`);
    }

    return { success: !!deleted };
  } catch (error) {
    console.error('❌ Failed to delete account:', { id, error });
    throw new Error('Internal error: failed to delete account');
  }
}