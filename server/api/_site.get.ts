import type { PublicSiteConfig } from '#shared/types/site'
import { applySiteSlugHeader, siteApiIdentityFromConfig } from '#shared/utils/applySiteSlugHeader'
import { guessApiSiteHostFromHostname } from '#shared/utils/guessApiSiteHost'
import { resolveApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'
import { normalizePublicSiteConfig } from '#shared/utils/normalizePublicSiteConfig'
import { getSiteRequestHost } from '#shared/utils/resolveSite'
import { toPublicSiteConfig } from '#shared/utils/toPublicSiteConfig'
import { shouldUseMockApi } from '#server/utils/shouldUseMockApi'

/**
 * В dev с NUXT_USE_MOCK_API=false этот хендлер может проксировать на реальный бэкенд,
 * чтобы полностью проверить цепочку (в т.ч. резолв сайта по Host на стороне бэкенда).
 * По умолчанию (и в production static) _site всегда отдаётся из локального реестра фронтенда
 * или приходит с бэкенда уже через прокси веб-сервера контент-домена.
 */
export default defineEventHandler(async (event): Promise<PublicSiteConfig> => {
  if (!shouldUseMockApi(event)) {
    const runtimeConfig = useRuntimeConfig(event)
    const baseURL = resolveApiBaseUrl(undefined, runtimeConfig.public.apiBase)

    if (baseURL) {
      const originalHost = getSiteRequestHost(event) || getRequestHeader(event, 'host') || ''

      try {
        const fetchOptions: { headers?: HeadersInit } = {
          headers: {
            Host: originalHost,
            'X-Forwarded-Host': originalHost,
          },
        }
        const site = event.context.site
        applySiteSlugHeader(
          fetchOptions,
          site
            ? siteApiIdentityFromConfig(site)
            : guessApiSiteHostFromHostname(originalHost.split(':')[0] ?? ''),
        )

        const upstream = await $fetch<unknown>('/api/_site', {
          baseURL,
          ...fetchOptions,
        })
        const config = normalizePublicSiteConfig(upstream)
        if (import.meta.dev) {
          console.log(
            `[proxy _site] Host=${originalHost} → real backend returned site (slug=${config.slug})`,
          )
        }
        return config
      } catch (err) {
        if (import.meta.dev) {
          console.error('[proxy _site] failed, falling back to local site registry', err)
        }
        // Если upstream ещё не готов — отдаём локальный конфиг, чтобы не ломать dev полностью.
      }
    }
  }

  // Обычное поведение: локальный реестр (используется в проде Variant 3 после generate + в dev по умолчанию)
  return toPublicSiteConfig(event.context.site)
})
