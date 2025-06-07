import { transfers } from './data';
import { transferFactory } from './factories/transferFactory';

export async function seed() {
  transfers.length = 0;
  for (let i = 0; i < 100; i++) {
    transfers.push(transferFactory.build());
  }
}

if (require.main === module) {
  seed().then(() => console.log('seeded transfers:', transfers.length));
}
