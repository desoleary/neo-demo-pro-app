import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DynamicTable } from './DynamicTable';
import { userTableColumns, UserRow } from '../schemas/userTableSchema';

describe('DynamicTable', () => {
  it('renders table rows', () => {
    const rows: UserRow[] = [
      { id: '1', email: 'a@b.com', tier: 'gold' },
      { id: '2', email: 'b@c.com', tier: 'silver' },
    ];
    render(<DynamicTable columns={userTableColumns} data={rows} />);
    expect(screen.getByText('a@b.com')).toBeInTheDocument();
    expect(screen.getByText('b@c.com')).toBeInTheDocument();
  });
});
