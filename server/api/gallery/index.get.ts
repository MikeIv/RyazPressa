import { getGalleryForSite } from '#shared/mock/siteMockAccess'
import { paginate } from '#shared/utils/paginate'

export default defineEventHandler((event) => {
  assertSection(event, 'gallery', 'gallery')
  const slug = event.context.site.slug
  const items = getGalleryForSite(slug)
  const { page, perPage } = parsePageQuery(event)

  return paginate(items, page, perPage)
})
