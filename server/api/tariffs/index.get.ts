import { mockTariffsIndex } from '../../mock/handlers/tariffs'

export default defineEventHandler((event) => handleApiRequest(event, mockTariffsIndex))
