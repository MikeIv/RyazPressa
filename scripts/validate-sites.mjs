/**
 * Валидация реестра сайтов.
 * Usage: pnpm validate:sites
 */

import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const { createJiti } = require('jiti')

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': path.join(root, 'shared'),
  },
})

await jiti.import('./validate-sites.runner.ts')
