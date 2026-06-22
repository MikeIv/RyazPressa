import type { H3Event } from 'h3'
import { getMockProjectDetail } from '#shared/mock/projects'
import { getNewsForSite, getArticlesForSite } from '#shared/mock/siteMockAccess'
import { filterNewsTodayAndYesterday } from '#shared/utils/groupNewsByDay'
import { normalizePostDetailResponse } from '#shared/utils/normalizePostsApi'
import { paginate } from '#shared/utils/paginate'

export function mockNewsIndex(event: H3Event) {
  const siteSlug = event.context.site.slug
  const query = getQuery(event)
  let items = getNewsForSite(siteSlug)

  const category = query.category
  if (typeof category === 'string' && category.trim()) {
    items = items.filter((item) => item.category === category.trim())
  }

  if (query.period === 'today-yesterday') {
    items = filterNewsTodayAndYesterday(items)
  }

  const { page, perPage } = parsePageQuery(event)
  return paginate(items, page, perPage)
}

export function mockNewsBySlug(event: H3Event) {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const siteSlug = event.context.site.slug
  const articles = getArticlesForSite(siteSlug)
  const article = articles.find((a) => a.slug === slug)
  if (article) {
    return normalizePostDetailResponse(article)
  }

  const project = getMockProjectDetail(slug)
  if (project) {
    return normalizePostDetailResponse({ id: project.slug, ...project })
  }

  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}
