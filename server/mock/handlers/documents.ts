import type { H3Event } from 'h3'
import { getDocumentsForSite } from '#shared/mock/siteMockAccess'
import { paginate } from '#shared/utils/paginate'

export function mockDocumentsIndex(event: H3Event) {
  const slug = event.context.site.slug
  const items = getDocumentsForSite(slug)
  const { page, perPage } = parsePageQuery(event)

  return paginate(items, page, perPage)
}
