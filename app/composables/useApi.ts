import { joinApiUrl, normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import type { AsyncData, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

/**
 * Императивный HTTP-клиент (`ofetch`) с `baseURL` из конфига текущего сайта.
 * Используйте в обработчиках, плагинах и `useAsyncData` + ручной вызов.
 */
export function useApi() {
  const runtimeConfig = useRuntimeConfig()
  const { site } = useSiteConfig()

  return $fetch.create({
    onRequest({ options }) {
      const base = normalizeApiBaseUrl(site.value?.apiBase ?? runtimeConfig.public.apiBase)
      if (base) {
        options.baseURL = base
      }
    },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[useApi]', String(ctx.request), ctx.response.status, ctx.response._data)
      }
    },
  })
}

/**
 * Реактивный `useFetch` к API текущего сайта: URL из `apiBase` сайта + путь.
 * Второй аргумент — без `baseURL` и без дженерика на `UseFetchOptions` (ограничение типов Nuxt 4);
 * тип ответа задаётся параметром `T` у возвращаемого `AsyncData<T, …>`.
 */
export function useApiFetch<T = unknown>(
  path: MaybeRefOrGetter<string>,
  options?: Omit<UseFetchOptions<unknown>, 'baseURL'>,
): AsyncData<T, FetchError | null> {
  const runtimeConfig = useRuntimeConfig()
  const { site } = useSiteConfig()

  const request = computed(() =>
    joinApiUrl(site.value?.apiBase ?? runtimeConfig.public.apiBase, String(toValue(path))),
  )

  return useFetch(request, options) as AsyncData<T, FetchError | null>
}
