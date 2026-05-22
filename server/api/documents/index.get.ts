import { getDocumentsForSite } from '#shared/mock/siteMockAccess'
import { paginate } from '#shared/utils/paginate'

export default defineEventHandler((event) => {
  assertSection(event, 'documents', 'documents')
  const slug = event.context.site.slug
  const items = getDocumentsForSite(slug)
  const { page, perPage } = parsePageQuery(event)

  return paginate(items, page, perPage)
})
