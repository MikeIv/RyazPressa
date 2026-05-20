import { mockProjects } from '#shared/mock/projects'

export default defineEventHandler((event) => {
  assertSection(event, 'projects', 'projects')
  return { data: mockProjects }
})
