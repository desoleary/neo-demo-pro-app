import { Factory } from 'fishery';
import { Reward } from '../data';

export const rewardFactory = Factory.define<Reward>(({ sequence }) => ({
  id: sequence.toString(),
  description: `Reward ${sequence}`,
  points: (sequence + 1) * 10,
}));
