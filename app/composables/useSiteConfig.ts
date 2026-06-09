import type { PublicSiteConfig } from '#shared/types/site'
import { getSiteConfigFetchParams } from '#shared/utils/siteConfigFetch'

/**
 * Конфиг текущего сайта (по домену запроса). Кэшируется на время сессии.
 *
 * Если в runtimeConfig.public.siteConfigApiBase задан адрес (например https://api.ryazpressa.ru),
 * то запрос /api/_site делается абсолютным на этот хост.
 * Браузер в этом случае отправит Host: api.ryazpressa.ru (как просили DevOps).
 * Мы дополнительно отправляем стандартные заголовки X-Forwarded-Host и X-Forwarded-Proto,
 * чтобы бэкенд мог определить реальный контент-домен.
 */
export function useSiteConfig() {
  const { url, options } = getSiteConfigFetchParams(useRuntimeConfig().public)

  const { data, pending, error, refresh } = useFetch<PublicSiteConfig>(url, options)

  const site = computed(() => data.value ?? null)

  return {
    site,
    pending,
    error,
    refresh,
  }
}
