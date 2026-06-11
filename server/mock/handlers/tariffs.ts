import type { H3Event } from 'h3'
import { mockTariffs } from '#shared/mock/tariffs'

export function mockTariffsIndex(_event: H3Event) {
  return { data: mockTariffs }
}
