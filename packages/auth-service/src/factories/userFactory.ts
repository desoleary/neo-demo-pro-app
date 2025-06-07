import { Factory } from 'fishery';
import { User } from '../data';

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence.toString(),
  email: `user${sequence}@example.com`,
  password: 'password',
  tier: ['basic', 'gold', 'platinum'][sequence % 3],
}));
