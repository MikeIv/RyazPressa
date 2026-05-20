import { mockNearUs } from '#shared/mock/near-us'

export default defineEventHandler((event) => {
  assertSection(event, 'ryadomSNami', 'near-us')
  return mockNearUs
})
