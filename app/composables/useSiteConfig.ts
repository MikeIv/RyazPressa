import type { PublicSiteConfig } from '#shared/types/site'

/**
 * Конфиг текущего сайта (по домену запроса). Кэшируется на время сессии.
 */
export function useSiteConfig() {
  const { data, pending, error, refresh } = useFetch<PublicSiteConfig>('/api/_site', {
    key: 'site-config',
  })

  const site = computed(() => data.value ?? null)

  return {
    site,
    pending,
    error,
    refresh,
  }
}
