import type { H3Event } from 'h3'
import { getGalleryForSite } from '#shared/mock/siteMockAccess'
import { paginate } from '#shared/utils/paginate'

export function mockGalleryIndex(event: H3Event) {
  const slug = event.context.site.slug
  const items = getGalleryForSite(slug)
  const { page, perPage } = parsePageQuery(event)

  return paginate(items, page, perPage)
}
