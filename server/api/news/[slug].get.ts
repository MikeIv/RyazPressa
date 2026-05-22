import { getArticlesForSite } from '#shared/mock/siteMockAccess'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const siteSlug = event.context.site.slug
  const articles = getArticlesForSite(siteSlug)
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return article
})
