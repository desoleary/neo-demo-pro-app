import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { userFactory } from './factories/userFactory';
import UserModel from './models/User';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export async function seed() {
  await connect(process.env.MONGO_URL as string);

  await UserModel.deleteMany({});

  const users = Array.from({ length: 100 }, () => userFactory.build());

  await UserModel.insertMany(users);

  console.log(`Seeded ${users.length} users.`);

  await disconnect();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
