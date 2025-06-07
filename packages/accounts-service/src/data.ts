export interface Account {
  id: string;
  userId: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  date: string;
}

export const accounts: Account[] = [];
export const transactions: Transaction[] = [];
