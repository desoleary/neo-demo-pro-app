import { ObjectId, MongoClient, Db } from 'mongodb';

interface UserDoc {
  _id: ObjectId;
  email: string;
  name: string;
}

export function createResolvers(db: Db) {
  const users = db.collection<UserDoc>('users');
  return {
    Query: {
      async user(_: any, { id }: { id: string }) {
        const user = await users.findOne({ _id: new ObjectId(id) });
        return user ? { id: user._id.toHexString(), email: user.email, name: user.name } : null;
      },
    },
    User: {
      __resolveReference(ref: { id: string }) {
        return users.findOne({ _id: new ObjectId(ref.id) }).then((u) =>
          u ? { id: u._id.toHexString(), email: u.email, name: u.name } : null
        );
      },
    },
  };
}
