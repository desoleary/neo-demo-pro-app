import { describe, expect, it } from 'vitest';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';

describe('gateway', () => {
  it('loads observability plugin', () => {
    expect(typeof createObservabilityPlugins).toBe('function');
  });
});
