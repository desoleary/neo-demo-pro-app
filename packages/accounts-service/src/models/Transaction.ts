import { Schema, model, InferSchemaType } from 'mongoose';

const transactionSchema = new Schema({
  accountId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true }
});

export type Transaction = InferSchemaType<typeof transactionSchema> & { _id: string };
export default model('Transaction', transactionSchema);
