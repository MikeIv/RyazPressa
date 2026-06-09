import { getSiteConfigFetchParams, readSiteConfigApiBase } from '#shared/utils/siteConfigFetch'

/**
 * URL и опции `useFetch` для `/api/_site` из `runtimeConfig.public`.
 * Тип `siteConfigApiBase` — в `types/nuxt-public.d.ts` (augment `nuxt/schema`).
 */
export function useSiteConfigFetchParams() {
  const publicConfig = useRuntimeConfig().public
  const siteConfigApiBase =
    'siteConfigApiBase' in publicConfig ? publicConfig.siteConfigApiBase : undefined

  const siteSlug = 'siteSlug' in publicConfig ? publicConfig.siteSlug : undefined

  return getSiteConfigFetchParams(
    readSiteConfigApiBase(siteConfigApiBase),
    typeof siteSlug === 'string' ? siteSlug : undefined,
  )
}
