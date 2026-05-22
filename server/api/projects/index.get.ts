import { mockProjectsIndex } from '../../mock/handlers/projects'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockProjectsIndex, { section: { key: 'projects', label: 'projects' } }),
)
