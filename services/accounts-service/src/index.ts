import { createServer } from '@graphql-yoga/node';
import { ObjectId, MongoClient } from 'mongodb';

export const typeDefs = /* GraphQL */ `
  type Account {
    id: ID!
    userId: ID!
    balance: Float!
    currency: String!
    type: String!
  }

  type Transaction {
    id: ID!
    fromAccount: ID!
    toAccount: ID!
    amount: Float!
    status: String!
    timestamp: String!
  }

  type Query {
    getUserAccounts(userId: ID!): [Account!]!
    getTransactionHistory(accountId: ID!): [Transaction!]!
  }
`;

interface Account {
  _id: ObjectId;
  userId: ObjectId;
  balance: number;
  currency: string;
  type: string;
}

interface Transaction {
  _id: ObjectId;
  fromAccount: ObjectId;
  toAccount: ObjectId;
  amount: number;
  status: string;
  timestamp: string;
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/accounts';

export async function createServerInstance() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const accounts = db.collection<Account>('accounts');
  const transactions = db.collection<Transaction>('transactions');

  const resolvers = {
    Query: {
      async getUserAccounts(_: any, { userId }: { userId: string }) {
        const accs = await accounts.find({ userId: new ObjectId(userId) }).toArray();
        return accs.map((a) => ({ ...a, id: a._id.toHexString(), userId: a.userId.toHexString() }));
      },
      async getTransactionHistory(_: any, { accountId }: { accountId: string }) {
        const txs = await transactions.find({
          $or: [{ fromAccount: new ObjectId(accountId) }, { toAccount: new ObjectId(accountId) }],
        })
          .sort({ timestamp: -1 })
          .toArray();
        return txs.map((t) => ({
          ...t,
          id: t._id.toHexString(),
          fromAccount: t.fromAccount.toHexString(),
          toAccount: t.toAccount.toHexString(),
        }));
      },
    },
  };

  const server = createServer({ schema: { typeDefs, resolvers } });
  return server;
}

if (require.main === module) {
  createServerInstance()
    .then((server) => {
      const port = process.env.PORT || 4002;
      server.start({ port }, () => {
        console.log(`accounts-service listening on ${port}`);
      });
    })
    .catch((err) => console.error(err));
}
