import { mockGalleryIndex } from '../../mock/handlers/gallery'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockGalleryIndex, { section: { key: 'gallery', label: 'gallery' } }),
)
