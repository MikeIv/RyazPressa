import type { PublicSiteConfig, SiteConfig } from '#shared/types/site'
import { getPrimarySiteDomain } from '#shared/utils/getPrimarySiteDomain'

export function toPublicSiteConfig(site: SiteConfig): PublicSiteConfig {
  const { domains, ...publicConfig } = site

  return {
    ...publicConfig,
    apiSiteHost: getPrimarySiteDomain(domains) ?? site.slug,
  }
}
