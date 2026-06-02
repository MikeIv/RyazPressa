/** Ryazpressa: `/news/slug` → `/slug` (новости на главной, без префикса). */
export default defineNuxtRouteMiddleware((to) => {
  const { site } = useSiteConfig()

  if (site.value?.articlePathPrefix !== '') return

  const slug = String(to.params.slug ?? '').trim()
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
  }

  return navigateTo(`/${slug}`, { redirectCode: 301 })
})
