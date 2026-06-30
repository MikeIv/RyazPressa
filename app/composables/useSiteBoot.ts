import { isRyazpressaClientHost } from '#shared/utils/resolveClientSiteSlug'

/**
 * Экран первичной загрузки для сайтов, отличных от ryazpressa.
 * Скрывает шапку с дефолтной «главной» темой до ответа `/api/_site`.
 */
export function useSiteBoot() {
  const { site, pending: sitePending } = useSiteConfig()
  const devSiteSlug = useRuntimeConfig().public.siteSlug

  const devSlug = typeof devSiteSlug === 'string' ? devSiteSlug : undefined
  const isMainEdition =
    import.meta.client && isRyazpressaClientHost(window.location.hostname, devSlug)

  const showBootScreen = computed(() => {
    if (!import.meta.client || isMainEdition) return false
    return sitePending.value && !site.value
  })

  return {
    showBootScreen,
  }
}
