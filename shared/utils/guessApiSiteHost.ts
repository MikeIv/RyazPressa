import { getSiteBySlug } from '#shared/sites'
import { getPrimarySiteDomain } from '#shared/utils/getPrimarySiteDomain'
import { isLocalDevHost } from '#shared/utils/resolveSite'

/** Убирает `www.` / `web.` — для `X-Site-Slug` до первого `/api/_site` (бэкенд ждёт apex-домен). */
export function guessApiSiteHostFromHostname(hostname: string): string {
  let host = hostname.split(':')[0]?.toLowerCase() ?? ''
  if (host.startsWith('www.')) host = host.slice(4)
  if (host.startsWith('web.')) host = host.slice(4)
  return host
}

/**
 * Домен для `X-Site-Slug` при запросе `/api/_site`.
 * На localhost — из реестра по `NUXT_SITE_SLUG`, иначе — нормализация hostname.
 */
export function resolveApiSiteHostForSiteConfig(hostname: string, devSiteSlug?: string): string {
  if (isLocalDevHost(hostname) && devSiteSlug?.trim()) {
    const site = getSiteBySlug(devSiteSlug.trim())
    if (site) {
      return getPrimarySiteDomain(site.domains) ?? site.slug
    }
  }

  return guessApiSiteHostFromHostname(hostname)
}
