export interface User {
  id: string;
  email: string;
  password: string;
  tier: string;
}

export const users: User[] = [];
