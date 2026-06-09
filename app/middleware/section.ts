import type { PublicSiteConfig, SiteSections } from '#shared/types/site'

export default defineNuxtRouteMiddleware(async (to) => {
  const section = to.meta.section as keyof SiteSections | undefined
  if (!section) return

  const runtimeConfig = useRuntimeConfig()
  const siteConfigApiBase = runtimeConfig.public.siteConfigApiBase as string | undefined

  let request: string | (() => string) = '/api/_site'
  const fetchOptions: {
    key: string
    onRequest?: (ctx: { options: { headers?: HeadersInit } }) => void
  } = { key: 'site-config' }

  if (siteConfigApiBase) {
    const base = siteConfigApiBase.replace(/\/+$/, '')
    request = `${base}/api/_site`
    fetchOptions.onRequest = ({ options }) => {
      if (typeof window !== 'undefined') {
        const headers = new Headers(options.headers)
        // Эмулируем X-Forwarded-* как при реальном проксировании
        headers.set('X-Forwarded-Host', window.location.host)
        headers.set('X-Forwarded-Proto', window.location.protocol.replace(':', ''))
        options.headers = headers
      }
    }
  }

  const { data: site } = await useFetch<PublicSiteConfig>(request, fetchOptions)

  if (!site.value?.sections[section]) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Раздел недоступен на этом сайте',
    })
  }
})
