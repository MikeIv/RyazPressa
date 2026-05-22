import type { SiteManifestEntry } from '#shared/sites/createBaseSite'
import { createBaseSiteConfig } from '#shared/sites/createBaseSite'
import siteManifest from '#shared/sites/manifest.json'

export const siteManifestEntries: readonly SiteManifestEntry[] = siteManifest

export const baseSiteConfigs = siteManifestEntries.map(createBaseSiteConfig)

export const nesecretnoSite = baseSiteConfigs.find((site) => site.slug === 'nesecretno')

if (!nesecretnoSite) {
  throw new Error('Site manifest must include nesecretno')
}
