import fs from 'node:fs'
import path from 'node:path'

/** Читает `SITE_BRAND_COLORS` из TypeScript-файла (для node-скриптов). */
export function loadSiteBrandColors(rootDir) {
  const source = fs.readFileSync(path.join(rootDir, 'shared/sites/siteBrandColors.ts'), 'utf8')
  const colors = {}
  const pattern =
    /['"]?([\w-]+)['"]?:\s*\{\s*colorPrimary:\s*'(#[^']+)',\s*colorAccent:\s*'(#[^']+)'\s*\}/g

  for (const match of source.matchAll(pattern)) {
    colors[match[1]] = { colorPrimary: match[2], colorAccent: match[3] }
  }

  return colors
}
