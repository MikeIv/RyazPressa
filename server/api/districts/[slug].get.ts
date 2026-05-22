import { mockDistrictBySlug } from '../../mock/handlers/districts'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockDistrictBySlug, { section: { key: 'okruga', label: 'districts' } }),
)
