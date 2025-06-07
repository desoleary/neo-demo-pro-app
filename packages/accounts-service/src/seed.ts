import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { accountFactory, transactionFactory } from './factories/accountFactory';
import AccountModel from './models/Account';
import TransactionModel from './models/Transaction';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export async function seed() {
  await connect(process.env.MONGO_URL as string);

  await AccountModel.deleteMany({});
  await TransactionModel.deleteMany({});

  const accounts = Array.from({ length: 100 }, () => accountFactory.build());
  const transactions = Array.from({ length: 100 }, () => transactionFactory.build());

  await AccountModel.insertMany(accounts);
  await TransactionModel.insertMany(transactions);

  console.log('Seeded accounts and transactions.');

  await disconnect();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
