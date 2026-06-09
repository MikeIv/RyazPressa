import type { PublicSiteConfig, SiteSections } from '#shared/types/site'
import { getSiteConfigFetchParams } from '#shared/utils/siteConfigFetch'

export default defineNuxtRouteMiddleware(async (to) => {
  const section = to.meta.section as keyof SiteSections | undefined
  if (!section) return

  const { url, options } = getSiteConfigFetchParams(useRuntimeConfig().public)
  const { data: site } = await useFetch<PublicSiteConfig>(url, options)

  if (!site.value?.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Раздел недоступен на этом сайте',
    })
  }
})
