import { getNewsForSite } from '#shared/mock/siteMockAccess'
import { filterNewsTodayAndYesterday } from '#shared/utils/groupNewsByDay'
import { paginate } from '#shared/utils/paginate'

export default defineEventHandler((event) => {
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
})
