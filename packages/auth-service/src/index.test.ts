import { describe, it, expect } from 'vitest';
import { createObservabilityPlugins } from '../../skeleton/src/index';

describe('auth-service', () => {
  it('loads observability plugin', () => {
    expect(typeof createObservabilityPlugins).toBe('function');
  });
});
