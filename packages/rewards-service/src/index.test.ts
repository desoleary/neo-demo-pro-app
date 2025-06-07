import { describe, it, expect } from 'vitest';
import { createObservabilityPlugins } from '@neo-rewards/skeleton';

describe('rewards-service', () => {
  it('loads observability plugin', () => {
    expect(typeof createObservabilityPlugins).toBe('function');
  });
});
