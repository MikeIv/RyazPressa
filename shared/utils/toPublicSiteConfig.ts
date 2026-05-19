import type { PublicSiteConfig, SiteConfig } from '#shared/types/site'

export function toPublicSiteConfig(site: SiteConfig): PublicSiteConfig {
  const { domains: _domains, ...publicConfig } = site
  return publicConfig
}
