import type { SiteConfig } from '#shared/types/site'
import { baseSiteConfigs } from '#shared/sites/baseSites'
import { ryazpressaSite } from '#shared/sites/ryazpressa'
import { assertValidSiteRegistry } from '#shared/sites/validateSiteRegistry'

export const sites: readonly SiteConfig[] = [ryazpressaSite, ...baseSiteConfigs]

assertValidSiteRegistry(sites)

const sitesBySlug = new Map(sites.map((s) => [s.slug, s]))

const sitesByDomain = new Map<string, SiteConfig>(
  sites.flatMap((s) => s.domains.map((domain) => [domain, s])),
)

export function getSiteBySlug(slug: string): SiteConfig | undefined {
  return sitesBySlug.get(slug)
}

export function getSiteByDomain(hostname: string): SiteConfig | undefined {
  return sitesByDomain.get(hostname.toLowerCase())
}

export { baseSiteConfigs, nesecretnoSite } from '#shared/sites/baseSites'
export { ryazpressaSite } from '#shared/sites/ryazpressa'
export { siteManifestEntries } from '#shared/sites/baseSites'
