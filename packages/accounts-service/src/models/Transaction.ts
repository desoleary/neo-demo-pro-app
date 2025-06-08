import { InferSchemaType, model, Schema } from 'mongoose';

const transactionSchema = new Schema({
  accountId: { type: String, required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

export type Transaction = InferSchemaType<typeof transactionSchema>;

export default model<Transaction>('Transaction', transactionSchema);