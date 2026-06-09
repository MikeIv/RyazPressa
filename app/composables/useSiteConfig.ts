import type { PublicSiteConfig } from '#shared/types/site'
import { getSiteConfigFetchParams, readApiBase } from '#shared/utils/siteConfigFetch'

const SITE_CONFIG_HANDLE_KEY = '__siteConfigHandle' as const
const SITE_CONFIG_VIEW_KEY = '__siteConfigView' as const

type SiteConfigAsyncData = ReturnType<typeof createSiteConfigFetch>

type SiteConfigView = {
  site: ComputedRef<PublicSiteConfig | null>
  pending: SiteConfigAsyncData['pending']
  error: SiteConfigAsyncData['error']
  refresh: SiteConfigAsyncData['refresh']
}

type SiteConfigNuxtApp = ReturnType<typeof useNuxtApp> & {
  [SITE_CONFIG_HANDLE_KEY]?: SiteConfigAsyncData
  [SITE_CONFIG_VIEW_KEY]?: SiteConfigView
}

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

function createSiteConfigFetch() {
  const { url, options } = useSiteConfigFetchParams()
  return useFetch<PublicSiteConfig>(url, options)
}

function getSiteConfigHandle(): SiteConfigAsyncData {
  const nuxtApp = useNuxtApp() as SiteConfigNuxtApp
  nuxtApp[SITE_CONFIG_HANDLE_KEY] ??= createSiteConfigFetch()
  return nuxtApp[SITE_CONFIG_HANDLE_KEY]
}

function buildSiteConfigView(handle: SiteConfigAsyncData): SiteConfigView {
  return {
    site: computed(() => handle.data.value ?? null),
    pending: handle.pending,
    error: handle.error,
    refresh: handle.refresh,
  }
}

/** Стартует единственный `useFetch` для `/api/_site` (из плагина `site-config`). */
export function initSiteConfig(): void {
  getSiteConfigHandle()
}

/**
 * Конфиг текущего сайта. Один `useFetch` на приложение (ключ `site-config`).
 *
 * При `NUXT_PUBLIC_API_BASE` запрос идёт на общий API-хост с `X-Site-Slug`
 * (и `X-Forwarded-Host` при cross-origin).
 */
export function useSiteConfig(): SiteConfigView {
  const nuxtApp = useNuxtApp() as SiteConfigNuxtApp
  const handle = getSiteConfigHandle()

  nuxtApp[SITE_CONFIG_VIEW_KEY] ??= buildSiteConfigView(handle)

  return nuxtApp[SITE_CONFIG_VIEW_KEY]
}

/** Дожидается загрузки конфига (для middleware и императивных сценариев). */
export async function ensureSiteConfigLoaded(): Promise<PublicSiteConfig | null> {
  const handle = getSiteConfigHandle()
  if (handle.data.value) return handle.data.value
  await handle
  return handle.data.value ?? null
}
