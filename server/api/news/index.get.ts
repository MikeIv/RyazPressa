import { mockNewsBySite } from '#shared/mock/news'
import { paginate } from '#shared/utils/paginate'

export default defineEventHandler((event) => {
  const siteSlug = event.context.site.slug
  const query = getQuery(event)
  let items = mockNewsBySite[siteSlug] ?? []

  const category = query.category
  if (typeof category === 'string' && category.trim()) {
    items = items.filter((item) => item.category === category.trim())
  }

  const { page, perPage } = parsePageQuery(event)
  return paginate(items, page, perPage)
})
