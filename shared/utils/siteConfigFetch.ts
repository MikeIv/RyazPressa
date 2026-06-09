import { applySiteSlugHeader } from '#shared/utils/applySiteSlugHeader'
import { resolveApiSiteHostForSiteConfig } from '#shared/utils/guessApiSiteHost'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { normalizePublicSiteConfig } from '#shared/utils/normalizePublicSiteConfig'
import type { PublicSiteConfig } from '#shared/types/site'

/** Безопасное чтение `runtimeConfig.public.siteConfigApiBase` (в т.ч. при `unknown` из env). */
export function readSiteConfigApiBase(siteConfigApiBase: unknown): string | undefined {
  return typeof siteConfigApiBase === 'string' ? siteConfigApiBase : undefined
}

/** URL для запроса конфига сайта: относительный или абсолютный на `siteConfigApiBase`. */
export function resolveSiteConfigRequestUrl(siteConfigApiBase: string | undefined): string {
  const base = normalizeApiBaseUrl(siteConfigApiBase)
  return base ? `${base}/api/_site` : '/api/_site'
}

/** Стандартные прокси-заголовки для cross-origin запроса `/api/_site` на API-хост. */
interface BrowserWindowLike {
  location: {
    host: string
    hostname: string
    protocol: string
  }
}

export function applySiteConfigProxyHeaders(
  options: { headers?: HeadersInit },
  devSiteSlug?: string,
): void {
  const browserWindow = (globalThis as typeof globalThis & { window?: BrowserWindowLike }).window
  if (!browserWindow) return

  const headers = new Headers(options.headers)
  headers.set('X-Forwarded-Host', browserWindow.location.host)
  headers.set('X-Forwarded-Proto', browserWindow.location.protocol.replace(':', ''))
  options.headers = headers

  const apiSiteHost = resolveApiSiteHostForSiteConfig(browserWindow.location.hostname, devSiteSlug)
  applySiteSlugHeader(options, apiSiteHost)
}

export interface SiteConfigFetchOptions {
  key: string
  transform: (body: unknown) => PublicSiteConfig
  onRequest?: (ctx: { options: { headers?: HeadersInit } }) => void
}

/** Общие опции `useFetch` для `/api/_site` (кэш-ключ + forwarded-заголовки при необходимости). */
export function buildSiteConfigFetchOptions(
  siteConfigApiBase: string | undefined,
  devSiteSlug?: string,
): SiteConfigFetchOptions {
  const base: SiteConfigFetchOptions = {
    key: 'site-config',
    transform: normalizePublicSiteConfig,
  }

  if (!siteConfigApiBase) {
    return base
  }

  return {
    ...base,
    onRequest: ({ options }) => applySiteConfigProxyHeaders(options, devSiteSlug),
  }
}

/** URL и опции `useFetch` для `/api/_site` по значению `siteConfigApiBase`. */
export function getSiteConfigFetchParams(
  siteConfigApiBase: string | undefined,
  devSiteSlug?: string,
) {
  return {
    url: resolveSiteConfigRequestUrl(siteConfigApiBase),
    options: buildSiteConfigFetchOptions(siteConfigApiBase, devSiteSlug),
  }
}
