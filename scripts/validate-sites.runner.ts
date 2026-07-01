/**
 * Валидация реестра сайтов: slug/domain, nav ↔ sections, logo, brand colors.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseSiteConfigs, siteManifestEntries } from '#shared/sites/baseSites'
import { sites } from '#shared/sites/index'
import { SITE_BRAND_COLORS } from '#shared/sites/siteBrandColors'
import { navFromSections, BASE_SITE_SECTIONS } from '#shared/sites/baseSections'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function expandDomains(domain: string): string[] {
  const variants = new Set<string>()
  const normalized = domain.trim().toLowerCase()

  const register = (host: string): void => {
    variants.add(host)
    if (!host.startsWith('www.')) variants.add(`www.${host}`)
  }

  register(normalized)
  try {
    register(new URL(`http://${normalized}`).hostname)
  } catch {
    /* ignore */
  }

  return [...variants]
}

const errors: string[] = []

const expectedBaseCount = 25
if (siteManifestEntries.length !== expectedBaseCount) {
  errors.push(
    `Expected ${expectedBaseCount} base sites in manifest, got ${siteManifestEntries.length}`,
  )
}

const expectedNav = navFromSections(BASE_SITE_SECTIONS)
const navKey = expectedNav.map((item) => item.to).join('|')
for (const site of baseSiteConfigs) {
  const siteNavKey = site.nav.map((item) => item.to).join('|')
  if (siteNavKey !== navKey) {
    errors.push(`[${site.slug}] nav drift from BASE_SITE_SECTIONS (expected derived nav)`)
  }
}

for (const entry of siteManifestEntries) {
  if (!entry.slug?.trim()) errors.push('Manifest entry without slug')
  if (!entry.name?.trim()) errors.push(`[${entry.slug}] missing name`)
  if (!entry.domain?.trim()) errors.push(`[${entry.slug}] missing domain`)

  if (!SITE_BRAND_COLORS[entry.slug]) {
    errors.push(`[${entry.slug}] missing brand colors in siteBrandColors.ts`)
  }

  const logoPath = path.join(root, 'public/sites', entry.slug, 'logo.svg')
  if (!fs.existsSync(logoPath)) {
    errors.push(`[${entry.slug}] missing logo: public/sites/${entry.slug}/logo.svg`)
  }

  const faviconFiles = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
  ] as const

  for (const filename of faviconFiles) {
    const faviconPath = path.join(root, 'public/sites', entry.slug, filename)
    if (!fs.existsSync(faviconPath)) {
      errors.push(`[${entry.slug}] missing favicon asset: public/sites/${entry.slug}/${filename}`)
    }
  }

  for (const domain of expandDomains(entry.domain)) {
    const owner = sites.find((site) => site.domains.map((d) => d.toLowerCase()).includes(domain))
    if (owner && owner.slug !== entry.slug) {
      errors.push(`Manifest domain "${domain}" conflicts with site "${owner.slug}"`)
    }
  }
}

const ryazpressaLogo = path.join(root, 'public/sites/ryazpressa/logo.svg')
if (!fs.existsSync(ryazpressaLogo)) {
  errors.push('Missing logo: public/sites/ryazpressa/logo.svg')
}

const ryazpressaFavicons = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
] as const
for (const filename of ryazpressaFavicons) {
  const faviconPath = path.join(root, 'public/sites/ryazpressa', filename)
  if (!fs.existsSync(faviconPath)) {
    errors.push(`Missing favicon asset: public/sites/ryazpressa/${filename}`)
  }
}

if (errors.length > 0) {
  console.error('validate-sites failed:\n')
  for (const message of errors) console.error(`  ✗ ${message}`)
  process.exit(1)
}

console.log(`✓ ${sites.length} sites in registry`)
console.log(`✓ ${siteManifestEntries.length} base sites in manifest`)
console.log(`✓ nav/sections, domains, logos, favicons, brand colors OK`)
