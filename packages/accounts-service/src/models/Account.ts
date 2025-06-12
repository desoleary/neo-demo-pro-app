import { Schema, model, Document, Types } from 'mongoose';

export enum AccountType {
  CHEQUING = 'CHEQUING',
  SAVINGS = 'SAVINGS',
}

export interface Account {
  userId: string;
  type: AccountType | keyof typeof AccountType;
  balance: number;
}

export interface AccountDocument extends Document<Types.ObjectId>, Account {
  _id: Types.ObjectId;
}

const AccountSchema = new Schema<AccountDocument>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: Object.values(AccountType), required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1 });

AccountSchema.pre<AccountDocument>('save', function (next) {
  if (typeof this.type === 'string' && this.type in AccountType) {
    this.type = AccountType[this.type as keyof typeof AccountType];
  }
  next();
});

const AccountModel = model<AccountDocument>('Account', AccountSchema);

export default AccountModel;