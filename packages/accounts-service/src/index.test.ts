import { describe, expect, beforeAll, afterAll, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import AccountModel from './models/Account';
import { accountFactory } from './factories/accountFactory';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongo.getUri();
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Account model', () => {
  it('creates an account', async () => {
    const account = await AccountModel.create(accountFactory.build());
    expect(account.userId).toBeDefined();
    const found = await AccountModel.findById(account._id).exec();
    expect(found?.userId).toBe(account.userId);
  });
});
