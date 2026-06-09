import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

/** URL для запроса конфига сайта: относительный или абсолютный на `siteConfigApiBase`. */
export function resolveSiteConfigRequestUrl(siteConfigApiBase: string | undefined): string {
  const base = normalizeApiBaseUrl(siteConfigApiBase)
  return base ? `${base}/api/_site` : '/api/_site'
}

/** Стандартные прокси-заголовки для cross-origin запроса `/api/_site` на API-хост. */
export function applySiteConfigProxyHeaders(options: { headers?: HeadersInit }): void {
  if (typeof window === 'undefined') return

  const headers = new Headers(options.headers)
  headers.set('X-Forwarded-Host', window.location.host)
  headers.set('X-Forwarded-Proto', window.location.protocol.replace(':', ''))
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
