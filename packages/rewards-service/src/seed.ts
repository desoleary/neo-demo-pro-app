import { rewards } from './data';
import { rewardFactory } from './factories/rewardFactory';

export async function seed() {
  rewards.length = 0;
  for (let i = 0; i < 100; i++) {
    rewards.push(rewardFactory.build());
  }
}

if (require.main === module) {
  seed().then(() => console.log('seeded rewards:', rewards.length));
}
