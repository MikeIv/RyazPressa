import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['shared/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '#shared': resolve(import.meta.dirname, 'shared'),
    },
  },
})
