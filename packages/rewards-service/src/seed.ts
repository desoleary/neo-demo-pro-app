import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { rewardFactory } from './factories/rewardFactory';
import RewardModel from './models/Reward';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export async function seed() {
  await connect(process.env.MONGO_URL as string);

  await RewardModel.deleteMany({});

  const rewards = Array.from({ length: 100 }, () => rewardFactory.build());

  await RewardModel.insertMany(rewards);

  console.log(`Seeded ${rewards.length} rewards.`);

  await disconnect();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
