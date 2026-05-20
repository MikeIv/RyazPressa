import { getMockProjectDetail } from '#shared/mock/projects'

export default defineEventHandler((event) => {
  assertSection(event, 'projects', 'projects')
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const project = getMockProjectDetail(slug)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  return project
})
