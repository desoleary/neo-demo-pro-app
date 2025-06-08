import { describe, expect, it } from 'vitest';
import { createObservabilityPlugins } from '../../skeleton/src/index';

describe('rewards-service', () => {
  it('loads observability plugin', () => {
    expect(typeof createObservabilityPlugins).toBe('function');
  });
});
