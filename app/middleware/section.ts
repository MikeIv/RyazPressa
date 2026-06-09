import type { PublicSiteConfig, SiteSections } from '#shared/types/site'
import {
  buildSiteConfigFetchOptions,
  resolveSiteConfigRequestUrl,
} from '#shared/utils/siteConfigFetch'

export default defineNuxtRouteMiddleware(async (to) => {
  const section = to.meta.section as keyof SiteSections | undefined
  if (!section) return

  const runtimeConfig = useRuntimeConfig()
  const siteConfigApiBase = runtimeConfig.public.siteConfigApiBase

  const { data: site } = await useFetch<PublicSiteConfig>(
    resolveSiteConfigRequestUrl(siteConfigApiBase),
    buildSiteConfigFetchOptions(siteConfigApiBase),
  )

  if (!site.value?.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Раздел недоступен на этом сайте',
    })
  }
})
