import { sites } from '#shared/sites'
import { getRequestHost, isLocalDevHost, resolveSite } from '#shared/utils/resolveSite'

const knownSiteSlugs = sites
  .map((entry) => entry.slug)
  .sort()
  .join(', ')

export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  const config = useRuntimeConfig(event)
  const fallbackSlug =
    typeof config.siteSlug === 'string' && config.siteSlug.trim()
      ? config.siteSlug.trim()
      : 'ryazpressa'

  const site = resolveSite(host, fallbackSlug)

  if (!site) {
    if (isLocalDevHost(host)) {
      throw createError({
        statusCode: 404,
        statusMessage: `Unknown NUXT_SITE_SLUG "${fallbackSlug}". Set a valid slug in .env and restart pnpm dev. Known slugs: ${knownSiteSlugs}`,
      })
    }

    throw createError({
      statusCode: 404,
      statusMessage: `Site not found for host: ${host || 'unknown'}`,
    })
  }

  event.context.site = site
})
