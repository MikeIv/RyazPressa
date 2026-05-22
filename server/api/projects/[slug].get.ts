import { mockProjectBySlug } from '../../mock/handlers/projects'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockProjectBySlug, { section: { key: 'projects', label: 'projects' } }),
)
