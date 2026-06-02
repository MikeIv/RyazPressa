import type { SiteConfig } from '#shared/types/site'
import { BASE_SITE_SECTIONS, navFromSections } from '#shared/sites/baseSections'
import { expandSiteDomains } from '#shared/sites/normalizeDomains'
import { createSiteTheme } from '#shared/sites/createSiteTheme'

export interface SiteManifestEntry {
  slug: string
  name: string
  domain: string
}

export function createBaseSiteConfig(entry: SiteManifestEntry): SiteConfig {
  const logoSrc = `/sites/${entry.slug}/logo.svg`

  return {
    slug: entry.slug,
    name: entry.name,
    domains: expandSiteDomains(entry.domain),
    apiBase: '',
    theme: createSiteTheme(entry.slug, entry.name, logoSrc),
    sections: { ...BASE_SITE_SECTIONS },
    nav: navFromSections(BASE_SITE_SECTIONS),
    articlePathPrefix: '/news',
  }
}
