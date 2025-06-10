import { describe, it, expect } from 'vitest';
import { buildMongoSort } from '@gql-utils';

describe('buildMongoSort', () => {
  it('returns ascending sort when order is ASC', () => {
    const result = buildMongoSort({ field: 'name', order: 'ASC' });
    expect(result).toEqual({ name: 1 });
  });

  it('returns descending sort when order is DESC', () => {
    const result = buildMongoSort({ field: 'name', order: 'DESC' });
    expect(result).toEqual({ name: -1 });
  });

  it('uses direction if order is not provided (ASC)', () => {
    const result = buildMongoSort({ field: 'balance', direction: 'ASC' });
    expect(result).toEqual({ balance: 1 });
  });

  it('uses direction if order is not provided (DESC)', () => {
    const result = buildMongoSort({ field: 'balance', direction: 'DESC' });
    expect(result).toEqual({ balance: -1 });
  });

  it('defaults to ascending sort if neither order nor direction is provided', () => {
    const result = buildMongoSort({ field: 'createdAt' });
    expect(result).toEqual({ createdAt: 1 });
  });

  it('maps field "id" to "_id" (ascending)', () => {
    const result = buildMongoSort({ field: 'id', order: 'ASC' });
    expect(result).toEqual({ _id: 1 });
  });

  it('maps field "id" to "_id" (descending)', () => {
    const result = buildMongoSort({ field: 'id', order: 'DESC' });
    expect(result).toEqual({ _id: -1 });
  });

  it('prioritizes order over direction when both are provided', () => {
    const result = buildMongoSort({ field: 'name', order: 'DESC', direction: 'ASC' });
    expect(result).toEqual({ name: -1 });
  });
});