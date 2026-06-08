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

  // apiBase намеренно не указан → undefined.
  // Для базовых изданий это означает "использовать глобальный fallback (NUXT_PUBLIC_API_BASE)".
  // Site-specific override делается в dedicated файле shared/sites/{slug}.ts (пример: ryazpressa.ts),
  // где apiBase указывается явно — тогда resolveApiBaseUrl предпочтёт его.
  return {
    slug: entry.slug,
    name: entry.name,
    domains: expandSiteDomains(entry.domain),
    theme: createSiteTheme(entry.slug, entry.name, logoSrc),
    sections: { ...BASE_SITE_SECTIONS },
    nav: navFromSections(BASE_SITE_SECTIONS),
    articlePathPrefix: '/news',
  }
}
