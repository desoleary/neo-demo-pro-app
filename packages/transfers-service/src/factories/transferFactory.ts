import { Factory } from 'fishery';
import { TransferResult, TransferStatus } from '../data';

const possibleStatuses: TransferStatus[] = ['PENDING', 'COMPLETED', 'FAILED'];

export const transferFactory = Factory.define<TransferResult>(({ sequence }) => ({
  id: sequence.toString(),
  status: possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)],
}));