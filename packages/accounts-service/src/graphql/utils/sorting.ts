export function buildMongoSort(orderBy: { field: string; order?: 'ASC' | 'DESC'; direction?: 'ASC' | 'DESC' }) {
  const { field, order, direction } = orderBy;
  const sortOrder = order || direction || 'ASC';
  const sortDirection = sortOrder === 'DESC' ? -1 : 1;
  const mongoField = field === 'id' ? '_id' : field;

  return { [mongoField]: sortDirection };
}