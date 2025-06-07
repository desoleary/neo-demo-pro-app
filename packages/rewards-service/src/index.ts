import { createServer } from '@graphql-yoga/node';
import { ObjectId, MongoClient } from 'mongodb';

export const typeDefs = /* GraphQL */ `
  type Reward {
    id: ID!
    userId: ID!
    merchant: String!
    points: Int!
    redeemed: Boolean!
    category: String!
  }

  type Query {
    getRewards(userId: ID!): [Reward!]!
  }

  type Mutation {
    redeemReward(id: ID!): Reward
  }
`;

interface Reward {
  _id: ObjectId;
  userId: ObjectId;
  merchant: string;
  points: number;
  redeemed: boolean;
  category: string;
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/rewards';

export async function createServerInstance() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const rewards = db.collection<Reward>('rewards');

  const resolvers = {
    Query: {
      async getRewards(_: any, { userId }: { userId: string }) {
        const r = await rewards.find({ userId: new ObjectId(userId) }).toArray();
        return r.map((x) => ({ ...x, id: x._id.toHexString(), userId: x.userId.toHexString() }));
      },
    },
    Mutation: {
      async redeemReward(_: any, { id }: { id: string }) {
        await rewards.updateOne({ _id: new ObjectId(id) }, { $set: { redeemed: true } });
        const reward = await rewards.findOne({ _id: new ObjectId(id) });
        if (!reward) return null;
        return { ...reward, id: reward._id.toHexString(), userId: reward.userId.toHexString() };
      },
    },
  };

  const server = createServer({ schema: { typeDefs, resolvers } });
  return server;
}

if (require.main === module) {
  createServerInstance()
    .then((server) => {
      const port = process.env.PORT || 4003;
      server.start({ port }, () => {
        console.log(`rewards-service listening on ${port}`);
      });
    })
    .catch((err) => console.error(err));
}
