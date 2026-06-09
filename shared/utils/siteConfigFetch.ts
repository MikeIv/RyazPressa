import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

type SiteConfigPublicRuntimeConfig = {
  siteConfigApiBase?: unknown
}

/** Безопасное чтение `runtimeConfig.public.siteConfigApiBase` (в т.ч. при `unknown` из env). */
export function readSiteConfigApiBase(
  publicRuntimeConfig: SiteConfigPublicRuntimeConfig,
): string | undefined {
  return typeof publicRuntimeConfig.siteConfigApiBase === 'string'
    ? publicRuntimeConfig.siteConfigApiBase
    : undefined
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
    protocol: string
  }
}

export function applySiteConfigProxyHeaders(options: { headers?: HeadersInit }): void {
  const browserWindow = (globalThis as typeof globalThis & { window?: BrowserWindowLike }).window
  if (!browserWindow) return

  const headers = new Headers(options.headers)
  headers.set('X-Forwarded-Host', browserWindow.location.host)
  headers.set('X-Forwarded-Proto', browserWindow.location.protocol.replace(':', ''))
  options.headers = headers
}

export interface SiteConfigFetchOptions {
  key: string
  onRequest?: (ctx: { options: { headers?: HeadersInit } }) => void
}

/** Общие опции `useFetch` для `/api/_site` (кэш-ключ + forwarded-заголовки при необходимости). */
export function buildSiteConfigFetchOptions(
  siteConfigApiBase: string | undefined,
): SiteConfigFetchOptions {
  if (!siteConfigApiBase) {
    return { key: 'site-config' }
  }

  return {
    key: 'site-config',
    onRequest: ({ options }) => applySiteConfigProxyHeaders(options),
  }
}

/** URL и опции `useFetch` для `/api/_site` из `runtimeConfig.public`. */
export function getSiteConfigFetchParams(publicRuntimeConfig: SiteConfigPublicRuntimeConfig) {
  const siteConfigApiBase = readSiteConfigApiBase(publicRuntimeConfig)

  return {
    url: resolveSiteConfigRequestUrl(siteConfigApiBase),
    options: buildSiteConfigFetchOptions(siteConfigApiBase),
  }
}
