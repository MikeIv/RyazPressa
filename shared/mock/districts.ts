import type { District, DistrictDetail } from '#shared/types/api'
import { mockNewsBySite } from '#shared/mock/news'

export const mockDistricts: District[] = [
  {
    slug: 'zheleznodorozhny',
    name: 'Железнодорожный',
    description: 'Новости Железнодорожного округа',
  },
  { slug: 'moskovsky', name: 'Московский', description: 'Новости Московского округа' },
  { slug: 'sovetsky', name: 'Советский', description: 'Новости Советского округа' },
]

export function getMockDistrictDetail(slug: string): DistrictDetail | undefined {
  const district = mockDistricts.find((d) => d.slug === slug)
  if (!district) return undefined

  return {
    ...district,
    news: (mockNewsBySite.ryazpressa ?? []).slice(0, 2),
  }
}
