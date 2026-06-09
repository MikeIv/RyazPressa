import type { PublicSiteConfig } from '#shared/types/site'

/**
 * Конфиг текущего сайта (по домену запроса). Кэшируется на время сессии.
 *
 * Если в runtimeConfig.public.siteConfigApiBase задан адрес (например https://api.ryazpressa.ru),
 * то запрос /api/_site делается абсолютным на этот хост.
 * Браузер в этом случае отправит Host: api.ryazpressa.ru (как просили DevOps).
 * В заголовке X-Original-Host передаём реальный домен страницы, чтобы бэкенд мог определить сайт.
 */
export function useSiteConfig() {
  const runtimeConfig = useRuntimeConfig()
  const siteConfigApiBase = runtimeConfig.public.siteConfigApiBase as string | undefined

  const request = computed(() => {
    if (siteConfigApiBase) {
      const base = siteConfigApiBase.replace(/\/+$/, '')
      return `${base}/api/_site`
    }
    return '/api/_site'
  })

  const { data, pending, error, refresh } = useFetch<PublicSiteConfig>(request, {
    key: 'site-config',
    onRequest({ options }) {
      if (siteConfigApiBase && typeof window !== 'undefined') {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        // Эмулируем стандартные прокси-заголовки, чтобы бэкенд видел оригинальный контент-домен
        headers.set('X-Forwarded-Host', window.location.host)
        headers.set('X-Forwarded-Proto', window.location.protocol.replace(':', ''))
        options.headers = headers
      }
    },
  })

  const site = computed(() => data.value ?? null)

  return {
    site,
    pending,
    error,
    refresh,
  }
}
