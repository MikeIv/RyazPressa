import type { PublicSiteConfig } from '#shared/types/site'
import { getSiteConfigFetchParams, readApiBase } from '#shared/utils/siteConfigFetch'

/**
 * URL и опции `useFetch` для `/api/_site` из глобального `runtimeConfig.public.apiBase`.
 */
export function useSiteConfigFetchParams() {
  const publicConfig = useRuntimeConfig().public
  const apiBase =
    readApiBase('apiBase' in publicConfig ? publicConfig.apiBase : undefined) ??
    readApiBase('siteConfigApiBase' in publicConfig ? publicConfig.siteConfigApiBase : undefined)
  const siteSlug = 'siteSlug' in publicConfig ? publicConfig.siteSlug : undefined

  return getSiteConfigFetchParams(apiBase, typeof siteSlug === 'string' ? siteSlug : undefined)
}

/**
 * Конфиг текущего сайта. Кэшируется на время сессии.
 *
 * При `NUXT_PUBLIC_API_BASE` запрос идёт на общий API-хост с `X-Site-Slug`
 * (и `X-Forwarded-Host` при cross-origin).
 */
export function useSiteConfig() {
  const { url, options } = useSiteConfigFetchParams()

  const { data, pending, error, refresh } = useFetch<PublicSiteConfig>(url, options)

  const site = computed(() => data.value ?? null)

  return {
    site,
    pending,
    error,
    refresh,
  }
}
