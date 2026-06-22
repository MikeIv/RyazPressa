import type { PublicSiteConfig } from '#shared/types/site'
import { resolveApiSiteHostForSiteConfig } from '#shared/utils/guessApiSiteHost'
import { getPrimarySiteDomain } from '#shared/utils/getPrimarySiteDomain'

interface BrowserWindowLike {
  location: {
    hostname: string
  }
}

/** Домен или slug для заголовка `X-Site-Slug` (бэкенд определяет сайт по домену). */
export interface SiteApiIdentity {
  slug?: string
  domain?: string
}

function resolveSiteApiHeaderValue(
  identity: string | SiteApiIdentity | undefined,
): string | undefined {
  if (!identity) return undefined
  if (typeof identity === 'string') return identity.trim() || undefined
  return identity.domain?.trim() || identity.slug?.trim() || undefined
}

/** Добавляет заголовок `X-Site-Slug` для multi-tenant API (см. docs/api-contract.md). */
export function applySiteSlugHeader(
  options: { headers?: HeadersInit },
  identity: string | SiteApiIdentity | undefined,
): void {
  const value = resolveSiteApiHeaderValue(identity)
  if (!value) return

  const headers = new Headers(options.headers)
  headers.set('X-Site-Slug', value)
  options.headers = headers
}

/** Идентификатор сайта для API из конфига Nitro. */
export function siteApiIdentityFromConfig(site: {
  slug: string
  domains: readonly string[]
}): SiteApiIdentity {
  return {
    slug: site.slug,
    domain: getPrimarySiteDomain(site.domains),
  }
}

/** Идентификатор сайта для API из публичного конфига (клиент). */
export function siteApiIdentityFromPublic(site: {
  slug: string
  apiSiteHost?: string
}): SiteApiIdentity {
  return {
    slug: site.slug,
    domain: site.apiSiteHost,
  }
}

/** Домен для `X-Site-Slug`: из `/api/_site` или по hostname до загрузки конфига. */
export function resolveClientSiteApiIdentity(
  site: PublicSiteConfig | null | undefined,
  devSiteSlug?: string,
): string | undefined {
  if (site) {
    return site.apiSiteHost.trim() || site.slug.trim() || undefined
  }

  const browserWindow = (globalThis as typeof globalThis & { window?: BrowserWindowLike }).window
  if (!browserWindow) return undefined

  return resolveApiSiteHostForSiteConfig(browserWindow.location.hostname, devSiteSlug)
}

/** Заголовки клиентских вызовов на общий API-хост (`api.ryazpressa.ru`). */
export function applyClientApiRequestHeaders(
  options: { headers?: HeadersInit },
  params: {
    site?: PublicSiteConfig | null
    devSiteSlug?: string
  },
): void {
  applySiteSlugHeader(options, resolveClientSiteApiIdentity(params.site, params.devSiteSlug))
}
