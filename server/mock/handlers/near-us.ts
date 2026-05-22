import type { H3Event } from 'h3'
import { mockNearUs } from '#shared/mock/near-us'

export function mockNearUsIndex(_event: H3Event) {
  return mockNearUs
}
