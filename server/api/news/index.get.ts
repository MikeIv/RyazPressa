import { mockNewsIndex } from '../../mock/handlers/news'

export default defineEventHandler((event) => handleApiRequest(event, mockNewsIndex))
