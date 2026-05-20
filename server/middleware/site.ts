import { getRequestHost, resolveSite } from '#shared/utils/resolveSite'

export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  const config = useRuntimeConfig(event)
  const fallbackSlug =
    typeof config.siteSlug === 'string' && config.siteSlug.trim()
      ? config.siteSlug.trim()
      : 'ryazpressa'

  const site = resolveSite(host, fallbackSlug)

  if (!site) {
    throw createError({
      statusCode: 404,
      statusMessage: `Site not found for host: ${host || 'unknown'}`,
    })
  }

  event.context.site = site
})
