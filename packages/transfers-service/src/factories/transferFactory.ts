import { Factory } from 'fishery';
import { TransferResult } from '../data';

export const transferFactory = Factory.define<TransferResult>(({ sequence }) => ({
  id: sequence.toString(),
  status: 'SUCCESS',
}));
