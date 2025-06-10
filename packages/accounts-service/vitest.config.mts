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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      all: true, // include files without tests in coverage
      exclude: [
        '**/*.d.ts',
        'src/**/index.ts',
        'src/__tests__/**',
        'src/__factories__/**',
        'src/graphql/schema/**',
        '**/vitest.setup.ts',
        '**/test-utils/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@types': path.resolve(__dirname, './src/types'),
      '@test-utils': path.resolve(__dirname, './src/__tests__/test-utils'),
      '@test-utils/*': path.resolve(__dirname, './src/__tests__/test-utils/*'),
      '@factories': path.resolve(__dirname, './src/__factories__'),
      '@factories/*': path.resolve(__dirname, './src/__factories__/*'),
      '@models': path.resolve(__dirname, './src/models'),
      '@models/*': path.resolve(__dirname, './src/models/*'),
      '@gql': path.resolve(__dirname, './src/graphql'),
      '@gql/*': path.resolve(__dirname, './src/graphql/*'),
      '@gql-types': path.resolve(__dirname, './src/graphql/types'),
      '@gql-queries': path.resolve(__dirname, './src/graphql/queries'),
      '@gql-queries/*': path.resolve(__dirname, './src/graphql/queries/*'),
      '@gql-mutations': path.resolve(__dirname, './src/graphql/mutations'),
      '@gql-mutations/*': path.resolve(__dirname, './src/graphql/mutations/*'),
      '@gql-utils': path.resolve(__dirname, './src/graphql/utils'),
      '@gql-utils/*': path.resolve(__dirname, './src/graphql/utils/*'),
    },
  },
});