import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { userFactory } from './factories/userFactory';
import UserModel from './models/User';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export async function seed() {
  try {
    console.log('Seeding users...');
    await UserModel.deleteMany({});

    const users = Array.from({ length: 100 }, () => userFactory.build());
    await UserModel.insertMany(users);

    console.log(`✅ Seeded ${users.length} users.`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Only run this file directly when executed from command line
if (require.main === module) {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/neo_demo_pro_app';
  
  mongoose.connect(mongoUrl)
    .then(() => seed())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => mongoose.connection.close());
}
