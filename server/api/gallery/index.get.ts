import { mockGalleryBySite } from '#shared/mock/gallery'
import { paginate } from '#shared/utils/paginate'

export default defineEventHandler((event) => {
  assertSection(event, 'gallery', 'gallery')
  const slug = event.context.site.slug
  const items = mockGalleryBySite[slug] ?? []
  const { page, perPage } = parsePageQuery(event)

  return paginate(items, page, perPage)
})
