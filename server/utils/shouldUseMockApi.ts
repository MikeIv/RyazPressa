import type { H3Event } from 'h3'

/** Mock API включён, если `NUXT_USE_MOCK_API` не равен `false`. */
export function shouldUseMockApi(event: H3Event): boolean {
  const { useMockApi } = useRuntimeConfig(event)
  return useMockApi !== false
}
