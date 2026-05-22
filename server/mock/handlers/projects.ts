import type { H3Event } from 'h3'
import { getMockProjectDetail, mockProjects } from '#shared/mock/projects'

export function mockProjectsIndex(_event: H3Event) {
  return { data: mockProjects }
}

export function mockProjectBySlug(event: H3Event) {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const project = getMockProjectDetail(slug)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  return project
}
