import { mockNewsBySlug } from '../../mock/handlers/news'

export default defineEventHandler((event) => handleApiRequest(event, mockNewsBySlug))
