import { getSiteByDomain, getSiteBySlug } from '#shared/sites'
import { guessApiSiteHostFromHostname } from '#shared/utils/guessApiSiteHost'
import { isLocalDevHost, isPreviewDeployHost } from '#shared/utils/resolveSite'

/** Slug сайта по hostname браузера (до ответа `/api/_site`). */
export function resolveClientSiteSlug(hostname: string, devSiteSlug?: string): string | undefined {
  const normalized = hostname.split(':')[0]?.toLowerCase() ?? ''

  if ((isLocalDevHost(normalized) || isPreviewDeployHost(normalized)) && devSiteSlug?.trim()) {
    return getSiteBySlug(devSiteSlug.trim())?.slug
  }

  const byHost = getSiteByDomain(normalized)
  if (byHost) return byHost.slug

  const apex = guessApiSiteHostFromHostname(normalized)
  return getSiteByDomain(apex)?.slug
}

export function isRyazpressaClientHost(hostname: string, devSiteSlug?: string): boolean {
  return resolveClientSiteSlug(hostname, devSiteSlug) === 'ryazpressa'
}
