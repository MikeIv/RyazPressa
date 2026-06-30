import { ensureSiteConfigLoaded } from '~/composables/useSiteConfig'

/** Ryazpressa: `/news/slug` → `/slug` (новости на главной, без префикса). */
export default defineNuxtRouteMiddleware(async (to) => {
  const slug = String(to.params.slug ?? '').trim()
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
  }

  const site = await ensureSiteConfigLoaded()

  if (site?.articlePathPrefix !== '') return

  return navigateTo(`/${slug}`, { redirectCode: 301 })
})
