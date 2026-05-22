import { mockDistrictsIndex } from '../../mock/handlers/districts'

export default defineEventHandler((event) =>
  handleApiRequest(event, mockDistrictsIndex, { section: { key: 'okruga', label: 'districts' } }),
)
