export type TransferStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  status: TransferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TransferResult {
  id: string;
  status: TransferStatus;
}

export const transfers: Transfer[] = [];
