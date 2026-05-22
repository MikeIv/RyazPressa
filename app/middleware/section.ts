import type { PublicSiteConfig, SiteSections } from '#shared/types/site'

export default defineNuxtRouteMiddleware(async (to) => {
  const section = to.meta.section as keyof SiteSections | undefined
  if (!section) return

  const { data: site } = await useFetch<PublicSiteConfig>('/api/_site', {
    key: 'site-config',
  })

  if (!site.value?.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Раздел недоступен на этом сайте',
    })
  }
})
