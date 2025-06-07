import { ObjectId } from 'mongodb';
import { accounts, transactions } from './data';
import { accountFactory, transactionFactory } from './factories/accountFactory';

export async function seed() {
  accounts.length = 0;
  transactions.length = 0;
  for (let i = 0; i < 100; i++) {
    const accountData = accountFactory.build();
    const accountId = new ObjectId();
    accounts.push({ ...accountData, id: accountId.toHexString() });

    const transactionData = transactionFactory.build({ accountId: accountId.toHexString() });
    transactions.push({ ...transactionData, id: new ObjectId().toHexString() });
  }
}

if (require.main === module) {
  seed().then(() => console.log('seeded accounts:', accounts.length));
}
