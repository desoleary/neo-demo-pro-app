import { accounts, transactions } from './data';
import { accountFactory, transactionFactory } from './factories/accountFactory';

export async function seed() {
  accounts.length = 0;
  transactions.length = 0;
  for (let i = 0; i < 100; i++) {
    accounts.push(accountFactory.build());
    transactions.push(transactionFactory.build());
  }
}

if (require.main === module) {
  seed().then(() => console.log('seeded accounts:', accounts.length));
}
