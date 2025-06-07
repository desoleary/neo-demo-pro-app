import { setupDomMocks } from './setupDomMocks';
import { setupCanvasMock } from './setupCanvasMock';

export function setupTestEnvironment(): void {
  setupCanvasMock();
  setupDomMocks();
}