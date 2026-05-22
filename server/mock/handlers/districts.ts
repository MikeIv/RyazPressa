import type { H3Event } from 'h3'
import { getMockDistrictDetail, mockDistricts } from '#shared/mock/districts'

export function mockDistrictsIndex(_event: H3Event) {
  return { data: mockDistricts }
}

export function mockDistrictBySlug(event: H3Event) {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const district = getMockDistrictDetail(slug)
  if (!district) {
    throw createError({ statusCode: 404, statusMessage: 'District not found' })
  }

  return district
}
