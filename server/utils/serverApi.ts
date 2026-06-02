import type { H3Event } from 'h3'
import { resolveApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { applySiteSlugHeader, siteApiIdentityFromConfig } from '#shared/utils/applySiteSlugHeader'

/**
 * HTTP-клиент из Nitro к API текущего сайта (`event.context.site.apiBase`).
 * Передавайте `event` в обработчиках route/api.
 */
export function serverApi(event?: H3Event) {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const baseURL = resolveApiBaseUrl(event?.context.site?.apiBase, config.public.apiBase)

  if (!baseURL) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'API base URL is not configured. Set NUXT_PUBLIC_API_BASE in .env or apiBase in site config.',
    })
  }

  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const site = event?.context.site
      applySiteSlugHeader(options, site ? siteApiIdentityFromConfig(site) : undefined)
    },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[serverApi]', String(ctx.request), ctx.response.status, ctx.response._data)
      }
    },
  })
}
