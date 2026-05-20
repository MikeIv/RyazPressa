import { getMockDistrictDetail } from '#shared/mock/districts'

export default defineEventHandler((event) => {
  assertSection(event, 'okruga', 'districts')
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const district = getMockDistrictDetail(slug)
  if (!district) {
    throw createError({ statusCode: 404, statusMessage: 'District not found' })
  }

  return district
})
