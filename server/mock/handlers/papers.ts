import type { H3Event } from 'h3'
import { mockPapers } from '#shared/mock/papers'

export function mockPapersIndex(_event: H3Event) {
  return { data: mockPapers }
}
