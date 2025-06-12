export function buildAccountQuery(
  userId: string,
  filter: {
    type?: string;
    minBalance?: number;
    maxBalance?: number;
  } = {}
) {
  const query: any = {
    $or: [
      { userId },
      { userId: typeof userId === 'string' ? parseInt(userId, 10) : userId },
    ].filter(Boolean),
  };

  if (filter) {
    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.minBalance !== undefined || filter.maxBalance !== undefined) {
      query.balance = {};
      if (filter.minBalance !== undefined) {
        query.balance.$gte = filter.minBalance;
      }
      if (filter.maxBalance !== undefined) {
        query.balance.$lte = filter.maxBalance;
      }
    }
  }

  return query;
}