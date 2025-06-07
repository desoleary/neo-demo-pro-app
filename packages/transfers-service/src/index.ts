import { createServer } from '@graphql-yoga/node';
import { ObjectId, MongoClient } from 'mongodb';

export const typeDefs = /* GraphQL */ `
  type TransferResult {
    id: ID!
    fromAccount: ID!
    toAccount: ID!
    amount: Float!
    status: String!
  }

  type Mutation {
    initiateTransfer(fromAccount: ID!, toAccount: ID!, amount: Float!): TransferResult
  }
`;

interface Transfer {
  _id: ObjectId;
  fromAccount: ObjectId;
  toAccount: ObjectId;
  amount: number;
  status: string;
  timestamp: string;
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/transfers';

export async function createServerInstance() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db();
  const transfers = db.collection<Transfer>('transfers');

  const resolvers = {
    Mutation: {
      async initiateTransfer(_: any, { fromAccount, toAccount, amount }: { fromAccount: string; toAccount: string; amount: number }) {
        const transfer: Transfer = {
          _id: new ObjectId(),
          fromAccount: new ObjectId(fromAccount),
          toAccount: new ObjectId(toAccount),
          amount,
          status: 'completed',
          timestamp: new Date().toISOString(),
        };
        await transfers.insertOne(transfer);
        return {
          id: transfer._id.toHexString(),
          fromAccount: transfer.fromAccount.toHexString(),
          toAccount: transfer.toAccount.toHexString(),
          amount: transfer.amount,
          status: transfer.status,
        };
      },
    },
  };

  const server = createServer({ schema: { typeDefs, resolvers } });
  return server;
}

if (require.main === module) {
  createServerInstance()
    .then((server) => {
      const port = process.env.PORT || 4004;
      server.start({ port }, () => {
        console.log(`transfers-service listening on ${port}`);
      });
    })
    .catch((err) => console.error(err));
}
