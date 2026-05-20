import { mockDistricts } from '#shared/mock/districts'

export default defineEventHandler((event) => {
  assertSection(event, 'okruga', 'districts')
  return { data: mockDistricts }
})
