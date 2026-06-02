import {
  isNitroApiPath,
  resolveApiBaseUrl,
  resolveClientApiUrl,
} from '#shared/utils/normalizeApiBaseUrl'
import { applySiteSlugHeader, siteApiIdentityFromPublic } from '#shared/utils/applySiteSlugHeader'
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
    onRequest({ request, options }) {
      const requestPath = typeof request === 'string' ? request : String(request)
      if (!isNitroApiPath(requestPath)) {
        const base = resolveApiBaseUrl(site.value?.apiBase, runtimeConfig.public.apiBase)
        if (base) {
          options.baseURL = base
        }
      }
      applySiteSlugHeader(options, site.value ? siteApiIdentityFromPublic(site.value) : undefined)
    },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[useApi]', String(ctx.request), ctx.response.status, ctx.response._data)
      }
    },
  })
}

/**
 * Реактивный `useFetch` к API: пути `/api/*` — Nitro (mock/прокси), иначе `apiBase` + путь.
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
    resolveClientApiUrl(String(toValue(path)), site.value?.apiBase, runtimeConfig.public.apiBase),
  )

  return useFetch(request, {
    ...options,
    onRequest({ options: requestOptions }) {
      applySiteSlugHeader(
        requestOptions,
        site.value ? siteApiIdentityFromPublic(site.value) : undefined,
      )
    },
  }) as AsyncData<T, FetchError | null>
}
