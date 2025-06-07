import { ColumnConfig } from '../components/DynamicTable';

export interface UserRow {
  id: string;
  email: string;
  tier: string;
}

export const userTableColumns: ColumnConfig<UserRow>[] = [
  { key: 'id', header: 'ID' },
  { key: 'email', header: 'Email' },
  { key: 'tier', header: 'Tier' },
];
