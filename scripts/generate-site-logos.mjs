/**
 * Генерирует placeholder logo.svg для сайтов из manifest.json.
 * Usage: node scripts/generate-site-logos.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSiteBrandColors } from './lib/parseBrandColors.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'shared/sites/manifest.json'), 'utf8'))
const brandColors = loadSiteBrandColors(root)

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function logoSvg(name, slug) {
  const label = escapeXml(name)
  const fill = brandColors[slug]?.colorPrimary ?? '#1e73be'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40" role="img" aria-label="${label}">
  <rect width="160" height="40" fill="${fill}" rx="4" />
  <text
    x="80"
    y="26"
    text-anchor="middle"
    fill="#ffffff"
    font-family="system-ui, sans-serif"
    font-size="13"
    font-weight="700"
  >
    ${label}
  </text>
</svg>
`
}

for (const entry of manifest) {
  const dir = path.join(root, 'public/sites', entry.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'logo.svg'), logoSvg(entry.name, entry.slug), 'utf8')
  console.log(`✓ public/sites/${entry.slug}/logo.svg`)
}

console.log(`\nСгенерировано ${manifest.length} логотипов.`)
