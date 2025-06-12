import { connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { accountFactory, transactionFactory } from '@factories';

import { AccountModel, TransactionType, TransactionModel } from '@models';

import colours from '@test-utils/colours'; // adjust if you have different path

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const DEFAULT_NUMBER_OF_RECORDS = 100;
const MANUAL_TRANSACTION_COUNT = 1;

// Parse CLI args
const args = process.argv.slice(2);
const refreshFlag = args.includes('--refresh');

const recordCountArg = args.find(arg => arg.startsWith('--recordCount='));
const recordCount = recordCountArg
  ? parseInt(recordCountArg.split('=')[1], 10)
  : DEFAULT_NUMBER_OF_RECORDS;

console.log(`[seed] Config: recordCount=${recordCount}, refresh=${refreshFlag}`);

export async function seed({
                             skipDisconnect = false,
                             forceRefresh = refreshFlag,
                             numRecords = recordCount,
                           } = {}) {
  await connect(process.env.MONGO_URL as string);

  const accountCount = await AccountModel.countDocuments();
  const transactionCount = await TransactionModel.countDocuments();

  const EXPECTED_ACCOUNT_COUNT = numRecords;
  const EXPECTED_TRANSACTION_COUNT = numRecords + MANUAL_TRANSACTION_COUNT;

  const isUpToDate =
    accountCount === EXPECTED_ACCOUNT_COUNT &&
    transactionCount === EXPECTED_TRANSACTION_COUNT;

  if (isUpToDate && !forceRefresh) {
    console.log(colours.greenText(`[seed] Skipping seed — database already contains expected data.`));
    printUsage();
    if (!skipDisconnect) {
      await disconnect();
    }
    return;
  }

  console.log(colours.yellowText(`[seed] Seeding database...`));

  await AccountModel.deleteMany({});
  await TransactionModel.deleteMany({});

  // Insert accounts first
  const accounts = Array.from({ length: numRecords }, () => accountFactory.build());
  const insertedAccounts = await AccountModel.insertMany(accounts);

  // Now build transactions with correct transient param
  const transactions = insertedAccounts.map(account =>
    transactionFactory.build({}, { transient: { account } })
  );

  // Add manual transaction for accountId "1"
  transactions.push({
    accountId: '1',
    type: TransactionType.DEBIT,
    amount: 100,
    date: new Date()
  });

  await TransactionModel.insertMany(transactions);

  console.log(colours.greenText('[seed] Seeded accounts and transactions.'));

  printUsage();

  if (!skipDisconnect) {
    await disconnect();
  }
}

// Print usage section in cyan
function printUsage() {
  console.log(colours.cyanText(`
Usage:

  pnpm seed
    → Seed default 100 records (skip if already seeded)

  pnpm seed -- --refresh
    → Force reseed even if counts match

  pnpm seed -- --recordCount=200
    → Seed 200 records (skips if already seeded with 200 + manual)

  pnpm seed -- --recordCount=200 --refresh
    → Force reseed 200 records

Notes:
  - The manual transaction for accountId "1" is always included.
  - Skips disconnect if used in tests with { skipDisconnect: true }
`));
}

// Allows running `pnpm seed` or `tsx src/seed.ts`
if (require.main === module) {
  seed().catch((err) => {
    console.error(colours.redText('[seed] Seed failed:'), err);
    process.exit(1);
  });
}