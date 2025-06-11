import { Schema, model, Document } from 'mongoose';

export enum AccountType {
  CHEQUING = 'chequing',
  SAVINGS = 'savings',
}

export interface Account {
  userId: string;
  type: AccountType | keyof typeof AccountType;
  balance: number;
}

export type AccountDocument = Document & Account;

const AccountSchema = new Schema<Account>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: Object.values(AccountType), required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1 });

// Optional: normalize the type if passed as an enum key (e.g. 'SAVINGS' → 'savings')
AccountSchema.pre<AccountDocument>('save', function (next) {
  if (typeof this.type === 'string' && this.type in AccountType) {
    this.type = AccountType[this.type as keyof typeof AccountType];
  }
  next();
});

const AccountModel = model<Account>('Account', AccountSchema);

export default AccountModel;