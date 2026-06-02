/**
 * Favicon для ryazpressa из public/sites/ryazpressa/logo-single.png
 * Usage: node scripts/generate-ryazpressa-favicon.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'public/sites/ryazpressa/logo-single.png')
const outDir = path.join(root, 'public/sites/ryazpressa')

if (!fs.existsSync(src)) {
  console.error(`✗ Нет исходника: ${src}`)
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

async function resizePng(size) {
  return sharp(src)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

const png16 = await resizePng(16)
const png32 = await resizePng(32)
const png180 = await resizePng(180)

fs.writeFileSync(path.join(outDir, 'favicon.ico'), await toIco([png16, png32]))
fs.writeFileSync(path.join(outDir, 'favicon-16x16.png'), png16)
fs.writeFileSync(path.join(outDir, 'favicon-32x32.png'), png32)
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), png180)

console.log('✓ public/sites/ryazpressa/favicon.ico')
console.log('✓ public/sites/ryazpressa/favicon-16x16.png')
console.log('✓ public/sites/ryazpressa/favicon-32x32.png')
console.log('✓ public/sites/ryazpressa/apple-touch-icon.png')
