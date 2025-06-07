import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DynamicForm } from './DynamicForm';
import { userFormSchema } from '../schemas/userFormSchema';

describe('DynamicForm', () => {
  it('submits form values', async () => {
    const handleSubmit = vi.fn();
    render(<DynamicForm schema={userFormSchema} onSubmit={handleSubmit} />);
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText('Tier'), { target: { value: 'gold' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.com', tier: 'gold' });
  });
});
