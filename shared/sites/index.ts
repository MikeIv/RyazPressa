import type { SiteConfig } from '#shared/types/site'
import { nesecretnoSite } from '#shared/sites/nesecretno'
import { ryazpressaSite } from '#shared/sites/ryazpressa'

export const sites: readonly SiteConfig[] = [ryazpressaSite, nesecretnoSite]

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

export { nesecretnoSite, ryazpressaSite }
