import { z } from 'zod';
import { FormSchema } from '../components/DynamicForm';

export const userSchema = z.object({
  email: z.string().email(),
  tier: z.string(),
});

export const userFormSchema: FormSchema<typeof userSchema> = {
  fields: [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'tier', label: 'Tier', type: 'text' },
  ],
  validation: userSchema,
};
