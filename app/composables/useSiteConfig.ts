import type { PublicSiteConfig } from '#shared/types/site'

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
