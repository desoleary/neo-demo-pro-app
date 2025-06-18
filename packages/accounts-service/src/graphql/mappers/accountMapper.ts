export function toGraphQLAccount(doc: any): any {
  const base = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  const objectId = doc._id ?? base._id;
  if (!objectId) {
    throw new Error('Missing _id in account document');
  }

  const { _id, ...rest } = base;

  return {
    ...rest,
    id: objectId.toString(),
  };
}