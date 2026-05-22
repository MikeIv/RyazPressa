import type { H3Event } from 'h3'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { applySiteSlugHeader } from '#shared/utils/applySiteSlugHeader'

/**
 * HTTP-клиент из Nitro к API текущего сайта (`event.context.site.apiBase`).
 * Передавайте `event` в обработчиках route/api.
 */
export function serverApi(event?: H3Event) {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const siteApiBase = event?.context.site?.apiBase
  const baseURL = normalizeApiBaseUrl(siteApiBase ?? config.public.apiBase)

  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      applySiteSlugHeader(options, event?.context.site?.slug)
    },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[serverApi]', String(ctx.request), ctx.response.status, ctx.response._data)
      }
    },
  })
}
