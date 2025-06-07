import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import RewardModel from './models/Reward';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const REWARD_TITLES = [
  'Amazon Gift Card',
  'Starbucks Card',
  'Uber Eats Voucher',
  'Netflix Subscription',
  'Spotify Premium',
  'Movie Tickets',
  'Restaurant Voucher',
  'Shopping Spree',
  'Spa Day',
  'Tech Gadget'
];

export async function seed() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
  }

  await connect(process.env.MONGO_URL);

  try {
    await RewardModel.deleteMany({});

    const rewards = Array.from({ length: 100 }, (_, i) => ({
      id: uuidv4(),
      description: `${REWARD_TITLES[i % REWARD_TITLES.length]} #${Math.floor(i / REWARD_TITLES.length) + 1}`,
      points: Math.floor(Math.random() * 900) + 100, // Random points between 100-1000
      redeemed: Math.random() > 0.8, // 20% chance of being redeemed
      createdAt: new Date(),
      updatedAt: new Date()
    }));


    await RewardModel.insertMany(rewards);
    console.log(`✅ Seeded ${rewards.length} rewards`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
