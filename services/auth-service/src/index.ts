import { createServer } from '@graphql-yoga/node';
import { ObjectId, MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    fullName: String!
    tier: String!
  }

  type Query {
    getUserProfile(id: ID!): User
    login(email: String!, fullName: String!): String!
  }

  type Mutation {
    updateUserTier(id: ID!, tier: String!): User
  }
`;

interface User {
  _id: ObjectId;
  email: string;
  fullName: string;
  tier: string;
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/auth';
const JWT_SECRET = 'demo-secret';

export async function createServerInstance() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const users = db.collection<User>('users');

  const resolvers = {
    Query: {
      async getUserProfile(_: any, { id }: { id: string }) {
        const user = await users.findOne({ _id: new ObjectId(id) });
        if (!user) return null;
        return { id: user._id.toHexString(), email: user.email, fullName: user.fullName, tier: user.tier };
      },
      async login(_: any, { email, fullName }: { email: string; fullName: string }) {
        let user = await users.findOne({ email });
        if (!user) {
          const insert = await users.insertOne({ email, fullName, tier: 'standard' });
          user = { _id: insert.insertedId, email, fullName, tier: 'standard' };
        }
        return jwt.sign({ sub: user._id.toHexString(), tier: user.tier }, JWT_SECRET, { expiresIn: '1h' });
      },
    },
    Mutation: {
      async updateUserTier(_: any, { id, tier }: { id: string; tier: string }) {
        await users.updateOne({ _id: new ObjectId(id) }, { $set: { tier } });
        const user = await users.findOne({ _id: new ObjectId(id) });
        if (!user) return null;
        return { id: user._id.toHexString(), email: user.email, fullName: user.fullName, tier: user.tier };
      },
    },
  };

  const server = createServer({ schema: { typeDefs, resolvers } });
  return server;
}

if (require.main === module) {
  createServerInstance()
    .then((server) => {
      const port = process.env.PORT || 4001;
      server.start({ port }, () => {
        console.log(`auth-service listening on ${port}`);
      });
    })
    .catch((err) => console.error(err));
}
