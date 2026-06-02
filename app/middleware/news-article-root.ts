import { RESERVED_ROOT_SEGMENTS } from '#shared/utils/newsArticlePath'

/** Статья в корне (`/[slug]`) — только для сайтов с `articlePathPrefix: ''`. */
export default defineNuxtRouteMiddleware((to) => {
  const { site } = useSiteConfig()

  if (site.value?.articlePathPrefix !== '') {
    throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
  }

  const slug = String(to.params.slug ?? '')
  if (!slug || RESERVED_ROOT_SEGMENTS.has(slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
  }
})
