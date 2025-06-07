import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { transferFactory } from './factories/transferFactory';
import TransferModel from './models/Transfer';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export async function seed() {
  await connect(process.env.MONGO_URL as string);

  await TransferModel.deleteMany({});

  const transfers = Array.from({ length: 100 }, () => transferFactory.build());

  await TransferModel.insertMany(transfers);

  console.log(`Seeded ${transfers.length} transfers.`);

  await disconnect();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
