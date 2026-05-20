import type { PublicSiteConfig, SiteSections } from '#shared/types/site'

export default defineNuxtRouteMiddleware(async (to) => {
  const section = to.meta.section as keyof SiteSections | undefined
  if (!section) return

  const site = await $fetch<PublicSiteConfig>('/api/_site')

  if (!site.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Раздел недоступен на этом сайте',
    })
  }
})
