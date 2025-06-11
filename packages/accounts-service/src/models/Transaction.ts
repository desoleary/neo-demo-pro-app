import { Schema, model, Document } from 'mongoose';

export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface Transaction {
  accountId: string;
  type: TransactionType | keyof typeof TransactionType;
  amount: number;
  date: Date;
}

export type TransactionDocument = Document & Transaction;

const transactionSchema = new Schema<Transaction>(
  {
    accountId: { type: String, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

transactionSchema.index({ accountId: 1, date: -1 });

transactionSchema.pre<TransactionDocument>('save', function (next) {
  if (typeof this.type === 'string' && this.type in TransactionType) {
    this.type = TransactionType[this.type as keyof typeof TransactionType];
  }
  next();
});

const TransactionModel = model<Transaction>('Transaction', transactionSchema);

export default TransactionModel;