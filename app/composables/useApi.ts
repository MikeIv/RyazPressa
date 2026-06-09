import {
  contractPathFromRequest,
  resolveClientApiUrl,
  transformClientApiResponse,
} from '#shared/utils/clientApiBridge'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { applyClientApiRequestHeaders } from '#shared/utils/applySiteSlugHeader'
import type { AsyncData, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

function useApiClientContext() {
  const runtimeConfig = useRuntimeConfig()
  const { site } = useSiteConfig()
  const apiBase = normalizeApiBaseUrl(runtimeConfig.public.apiBase)
  const devSiteSlug =
    'siteSlug' in runtimeConfig.public && typeof runtimeConfig.public.siteSlug === 'string'
      ? runtimeConfig.public.siteSlug
      : undefined

  return {
    site,
    apiBase,
    crossOrigin: Boolean(apiBase),
    devSiteSlug,
    rawApiBase: runtimeConfig.public.apiBase,
  }
}

/**
 * Императивный HTTP-клиент (`ofetch`) к общему API (`NUXT_PUBLIC_API_BASE`).
 * Сайт передаётся заголовком `X-Site-Slug` (apex-домен контент-хоста).
 */
export function useApi() {
  const { site, apiBase, crossOrigin, devSiteSlug } = useApiClientContext()

  return $fetch.create({
    onRequest(ctx) {
      const requestPath = typeof ctx.request === 'string' ? ctx.request : String(ctx.request)
      if (apiBase && requestPath.startsWith('/')) {
        ctx.request = resolveClientApiUrl(requestPath, apiBase)
      }

      applyClientApiRequestHeaders(ctx.options, {
        site: site.value,
        devSiteSlug,
        crossOrigin,
      })
    },
    onResponse(ctx) {
      if (!apiBase) return

      const requestPath = typeof ctx.request === 'string' ? ctx.request : String(ctx.request)
      ctx.response._data = transformClientApiResponse(
        contractPathFromRequest(requestPath),
        ctx.response._data,
      )
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
 * При заданном `NUXT_PUBLIC_API_BASE` пути маппятся на бэкенд (`/api/news` → `/api/posts`),
 * ответы нормализуются как в Nitro-прокси.
 */
export function useApiFetch<T = unknown>(
  path: MaybeRefOrGetter<string>,
  options?: Omit<UseFetchOptions<unknown>, 'baseURL'>,
): AsyncData<T, FetchError | null> {
  const { site, apiBase, crossOrigin, devSiteSlug, rawApiBase } = useApiClientContext()
  const contractPath = computed(() => String(toValue(path)))
  const request = computed(() => resolveClientApiUrl(contractPath.value, rawApiBase))
  const userTransform = options?.transform

  return useFetch(request, {
    ...options,
    transform: (raw: unknown) => {
      let body = apiBase ? transformClientApiResponse(contractPath.value, raw) : raw
      if (userTransform) {
        body = userTransform(body)
      }
      return body
    },
    onRequest({ options: requestOptions }) {
      applyClientApiRequestHeaders(requestOptions, {
        site: site.value,
        devSiteSlug,
        crossOrigin,
      })
    },
  }) as AsyncData<T, FetchError | null>
}
