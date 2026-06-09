import type { PublicSiteConfig } from '#shared/types/site'
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

/**
 * Конфиг текущего сайта (по домену запроса). Кэшируется на время сессии.
 *
 * Если в runtimeConfig.public.siteConfigApiBase задан адрес (например https://api.ryazpressa.ru),
 * то запрос /api/_site делается абсолютным на этот хост.
 * Браузер в этом случае отправит Host: api.ryazpressa.ru (как просили DevOps).
 * Мы дополнительно отправляем X-Forwarded-Host, X-Forwarded-Proto и X-Site-Slug (apex-домен),
 * как требует бэкенд на api-хосте.
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
