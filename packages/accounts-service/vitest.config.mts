import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.test.json'],
    }),
  ],
  test: {
    globals: true,
    setupFiles: ['./src/__tests__/vitest.setup.ts'],
    include: [
      'src/__tests__/**/*.test.ts',
      'src/__tests__/**/*.spec.ts',
      'src/__tests__/**/*.model.test.ts',
    ],
  },
  resolve: {
    alias: {
      '@test-utils': path.resolve(__dirname, './src/__tests__/test-utils'),
    },
  },
});