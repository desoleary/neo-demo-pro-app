interface AccountFilter {
  type?: string;
  minBalance?: number;
  maxBalance?: number;
}

/**
 * Builds a MongoDB query for filtering accounts
 * @param userId - The user ID to filter by (can be string or number)
 * @param filter - Additional filters (type, minBalance, maxBalance)
 * @returns A MongoDB query object
 */
export function buildAccountQuery(
  userId: string | number,
  filter: AccountFilter = {}
) {
  // Create base query with user ID matching (supporting both string and number)
  const userIdStr = String(userId);
  const userIdNum = Number(userIdStr);
  
  // Build the base query with $or for both string and number user IDs
  const query: any = {
    $or: [
      { userId: userIdStr },
      ...(Number.isNaN(userIdNum) ? [] : [{ userId: userIdNum }])
    ]
  };

  // Apply type filter if provided
  if (filter.type) {
    query.type = filter.type;
  }

  // Apply balance range filters if provided
  if (filter.minBalance !== undefined || filter.maxBalance !== undefined) {
    query.balance = {};
    if (filter.minBalance !== undefined) {
      query.balance.$gte = filter.minBalance;
    }
    if (filter.maxBalance !== undefined) {
      query.balance.$lte = filter.maxBalance;
    }
  }

  return query;
}