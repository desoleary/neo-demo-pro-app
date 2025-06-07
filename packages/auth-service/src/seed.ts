import { users } from './data';
import { userFactory } from './factories/userFactory';

export async function seed() {
  users.length = 0;
  for (let i = 0; i < 100; i++) {
    users.push(userFactory.build());
  }
}

if (require.main === module) {
  seed().then(() => console.log('seeded users:', users.length));
}
