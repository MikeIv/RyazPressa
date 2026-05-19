import { toPublicSiteConfig } from '#shared/utils/toPublicSiteConfig'

export default defineEventHandler((event) => {
  return toPublicSiteConfig(event.context.site)
})
