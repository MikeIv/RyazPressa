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
 *
 * Variant 3 (pure SPA static, no Nitro at runtime):
 * - Paths starting with /api/ are the "frontend contract" served by backend on the *same* content domains
 *   as the deployed static files. We therefore force them to relative paths (current origin) via isNitroApiPath.
 * - site.apiBase (returned in /api/_site) is used as fallback/base for any non-contract direct backend calls
 *   (if the API origin is different from the content domain for a particular site).
 * - The very first /api/_site call has no site yet; backend must resolve the site from the Host header alone.
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
 * Реактивный `useFetch` к API.
 *
 * В Variant 3 (static SPA):
 * - Для путей `/api/*` (контракт, который бэкенд отдаёт на тех же доменах, где лежит статика) мы всегда
 *   возвращаем относительный путь (текущий origin). Это делает isNitroApiPath + resolveClientApiUrl.
 * - Для остальных путей (если понадобятся прямые вызовы) — используем site.apiBase (из /api/_site) или fallback.
 *
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
