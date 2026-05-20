import type { GalleryItem } from '#shared/types/api'

export const mockGalleryBySite: Record<string, GalleryItem[]> = {
  nesecretno: [
    {
      id: 'g1',
      title: 'Городской пейзаж',
      image: { url: '/mock/gallery-1.jpg', alt: 'Городской пейзаж' },
      publishedAt: '2026-05-10T12:00:00+03:00',
    },
    {
      id: 'g2',
      title: 'Региональное мероприятие',
      image: { url: '/mock/gallery-2.jpg', alt: 'Региональное мероприятие' },
      publishedAt: '2026-05-08T12:00:00+03:00',
    },
  ],
  ryazpressa: [],
}
