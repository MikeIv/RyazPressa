import { mockPapersIndex } from '../../mock/handlers/papers'

export default defineEventHandler((event) => handleApiRequest(event, mockPapersIndex))
