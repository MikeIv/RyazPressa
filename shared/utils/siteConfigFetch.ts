import { applyClientApiRequestHeaders } from '#shared/utils/applySiteSlugHeader'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { normalizePublicSiteConfig } from '#shared/utils/normalizePublicSiteConfig'
import type { PublicSiteConfig } from '#shared/types/site'

/** Ключ `useFetch` / `useNuxtData` для конфига сайта (singleton на приложение). */
export const SITE_CONFIG_KEY = 'site-config' as const

/** Безопасное чтение `runtimeConfig.public.apiBase` (в т.ч. при `unknown` из env). */
export function readApiBase(apiBase: unknown): string | undefined {
  return typeof apiBase === 'string' ? apiBase : undefined
}

/** URL для запроса конфига сайта: относительный или абсолютный на глобальный `apiBase`. */
export function resolveSiteConfigRequestUrl(apiBase: string | undefined): string {
  const base = normalizeApiBaseUrl(apiBase)
  return base ? `${base}/api/_site` : '/api/_site'
}

export interface SiteConfigFetchOptions {
  key: typeof SITE_CONFIG_KEY
  watch: false
  transform: (body: unknown) => PublicSiteConfig
  onRequest: (ctx: { options: { headers?: HeadersInit } }) => void
}

/** Общие опции `useFetch` для `/api/_site`. */
export function buildSiteConfigFetchOptions(devSiteSlug?: string): SiteConfigFetchOptions {
  return {
    key: SITE_CONFIG_KEY,
    watch: false,
    transform: normalizePublicSiteConfig,
    onRequest: ({ options }) => {
      applyClientApiRequestHeaders(options, {
        devSiteSlug,
      })
    },
  }
}

/** URL и опции `useFetch` для `/api/_site` по глобальному `apiBase`. */
export function getSiteConfigFetchParams(apiBase: string | undefined, devSiteSlug?: string) {
  return {
    url: resolveSiteConfigRequestUrl(apiBase),
    options: buildSiteConfigFetchOptions(devSiteSlug),
  }
}
